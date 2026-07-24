import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  runApp(const QuizVocabApp());
}

class QuizVocabApp extends StatefulWidget {
  const QuizVocabApp({super.key});

  @override
  State<QuizVocabApp> createState() => _QuizVocabAppState();
}

class _QuizVocabAppState extends State<QuizVocabApp> {
  ThemeMode themeMode = ThemeMode.light;

  void setDarkMode(bool isDark) {
    setState(() => themeMode = isDark ? ThemeMode.dark : ThemeMode.light);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Quiz Vocab',
      debugShowCheckedModeBanner: false,
      themeMode: themeMode,
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: const Color(0xFF4F46E5),
        brightness: Brightness.light,
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: const Color(0xFF818CF8),
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF020617),
      ),
      home: MainNavigationScreen(onThemeChanged: setDarkMode),
    );
  }
}

class Topic {
  const Topic({
    required this.id,
    required this.title,
    required this.titleVi,
    required this.icon,
    required this.level,
    required this.description,
  });

  final String id;
  final String title;
  final String titleVi;
  final IconData icon;
  final String level;
  final String description;
}

class VocabWord {
  const VocabWord({
    required this.id,
    required this.word,
    required this.meaning,
    required this.pronunciation,
    required this.example,
    required this.topicId,
    required this.level,
    required this.wrongOptions,
  });

  final String id;
  final String word;
  final String meaning;
  final String pronunciation;
  final String example;
  final String topicId;
  final String level;
  final List<String> wrongOptions;
}

enum QuestionType { meaning, reverse, blank, pronunciation, context }

class QuizQuestion {
  const QuizQuestion({
    required this.id,
    required this.word,
    required this.type,
    required this.prompt,
    required this.options,
    required this.correctAnswer,
    this.subPrompt,
    this.explanation,
  });

  final String id;
  final VocabWord word;
  final QuestionType type;
  final String prompt;
  final String? subPrompt;
  final List<String> options;
  final String correctAnswer;
  final String? explanation;
}

class WrongWordRecord {
  WrongWordRecord({
    required this.wordId,
    required this.wrongCount,
    required this.lastWrongAt,
  });

  final String wordId;
  int wrongCount;
  String lastWrongAt;

  Map<String, dynamic> toJson() => {
        'wordId': wordId,
        'wrongCount': wrongCount,
        'lastWrongAt': lastWrongAt,
      };

  static WrongWordRecord fromJson(Map<String, dynamic> json) {
    return WrongWordRecord(
      wordId: json['wordId'] as String? ?? '',
      wrongCount: (json['wrongCount'] as num?)?.toInt() ?? 1,
      lastWrongAt: json['lastWrongAt'] as String? ?? DateTime.now().toIso8601String(),
    );
  }
}

class TopicStat {
  TopicStat({this.completedCount = 0, this.highestScore = 0});

  int completedCount;
  int highestScore;

  Map<String, dynamic> toJson() => {
        'completedCount': completedCount,
        'highestScore': highestScore,
      };

  static TopicStat fromJson(Map<String, dynamic> json) {
    return TopicStat(
      completedCount: (json['completedCount'] as num?)?.toInt() ?? 0,
      highestScore: (json['highestScore'] as num?)?.toInt() ?? 0,
    );
  }
}

class UserProgress {
  UserProgress({
    this.totalQuizzes = 0,
    this.totalCorrect = 0,
    this.totalQuestions = 0,
    this.highScore = 0,
    this.streakDays = 1,
    String? lastActiveDate,
    Map<String, TopicStat>? topicStats,
    List<WrongWordRecord>? wrongWords,
  })  : lastActiveDate = lastActiveDate ?? todayString(),
        topicStats = topicStats ?? {},
        wrongWords = wrongWords ?? [];

  int totalQuizzes;
  int totalCorrect;
  int totalQuestions;
  int highScore;
  int streakDays;
  String lastActiveDate;
  Map<String, TopicStat> topicStats;
  List<WrongWordRecord> wrongWords;

  double get accuracy => totalQuestions == 0 ? 0 : totalCorrect / totalQuestions;

  Map<String, dynamic> toJson() => {
        'totalQuizzes': totalQuizzes,
        'totalCorrect': totalCorrect,
        'totalQuestions': totalQuestions,
        'highScore': highScore,
        'streakDays': streakDays,
        'lastActiveDate': lastActiveDate,
        'topicStats': topicStats.map((key, value) => MapEntry(key, value.toJson())),
        'wrongWords': wrongWords.map((record) => record.toJson()).toList(),
      };

  static UserProgress fromJson(Map<String, dynamic> json) {
    final stats = <String, TopicStat>{};
    final rawStats = json['topicStats'];
    if (rawStats is Map) {
      rawStats.forEach((key, value) {
        if (value is Map) {
          stats[key.toString()] = TopicStat.fromJson(Map<String, dynamic>.from(value));
        }
      });
    }

    final wrong = <WrongWordRecord>[];
    final rawWrong = json['wrongWords'];
    if (rawWrong is List) {
      for (final item in rawWrong) {
        if (item is Map) {
          final parsed = WrongWordRecord.fromJson(Map<String, dynamic>.from(item));
          if (parsed.wordId.isNotEmpty) {
            wrong.add(parsed);
          }
        }
      }
    }

    return UserProgress(
      totalQuizzes: (json['totalQuizzes'] as num?)?.toInt() ?? 0,
      totalCorrect: (json['totalCorrect'] as num?)?.toInt() ?? 0,
      totalQuestions: (json['totalQuestions'] as num?)?.toInt() ?? 0,
      highScore: (json['highScore'] as num?)?.toInt() ?? 0,
      streakDays: (json['streakDays'] as num?)?.toInt() ?? 1,
      lastActiveDate: json['lastActiveDate'] as String? ?? todayString(),
      topicStats: stats,
      wrongWords: wrong,
    );
  }
}

class QuizResultData {
  const QuizResultData({
    required this.topicId,
    required this.topicTitle,
    required this.correctCount,
    required this.totalQuestions,
    required this.wrongWords,
    required this.percent,
  });

  final String topicId;
  final String topicTitle;
  final int correctCount;
  final int totalQuestions;
  final List<VocabWord> wrongWords;
  final int percent;
}

String todayString() => DateTime.now().toIso8601String().split('T').first;

const topics = <Topic>[
  Topic(id: 'everyday', title: 'Everyday Life', titleVi: 'Cuộc sống hàng ngày', icon: Icons.wb_sunny_rounded, level: 'A1 - B1', description: 'Thói quen, nhà cửa và tình huống hằng ngày.'),
  Topic(id: 'school', title: 'School', titleVi: 'Trường học', icon: Icons.school_rounded, level: 'A1 - B2', description: 'Lớp học, bài kiểm tra và nghiên cứu.'),
  Topic(id: 'work', title: 'Work', titleVi: 'Công việc', icon: Icons.work_rounded, level: 'A2 - B2', description: 'Văn phòng, cuộc họp và giao tiếp chuyên nghiệp.'),
  Topic(id: 'travel', title: 'Travel', titleVi: 'Du lịch', icon: Icons.flight_takeoff_rounded, level: 'A1 - B2', description: 'Sân bay, khách sạn, lịch trình và điểm đến.'),
  Topic(id: 'food', title: 'Food', titleVi: 'Ẩm thực', icon: Icons.restaurant_rounded, level: 'A1 - B1', description: 'Món ăn, đồ uống, hương vị và nhà hàng.'),
  Topic(id: 'tech', title: 'Technology', titleVi: 'Công nghệ', icon: Icons.devices_rounded, level: 'A2 - B2', description: 'Thiết bị, phần mềm, AI và an toàn số.'),
  Topic(id: 'health', title: 'Health', titleVi: 'Sức khỏe', icon: Icons.favorite_rounded, level: 'A2 - B2', description: 'Triệu chứng, khám bệnh và lối sống khỏe.'),
  Topic(id: 'business', title: 'Business English', titleVi: 'Tiếng Anh thương mại', icon: Icons.trending_up_rounded, level: 'B1 - B2', description: 'Tài chính, hợp đồng và chiến lược.'),
  Topic(id: 'shopping', title: 'Shopping', titleVi: 'Mua sắm', icon: Icons.shopping_bag_rounded, level: 'A1 - B1', description: 'Giá cả, thanh toán, đổi trả và giao hàng.'),
  Topic(id: 'environment', title: 'Environment', titleVi: 'Môi trường', icon: Icons.eco_rounded, level: 'A2 - B2', description: 'Khí hậu, tái chế và bảo vệ thiên nhiên.'),
  Topic(id: 'sports', title: 'Sports & Hobbies', titleVi: 'Thể thao & sở thích', icon: Icons.sports_soccer_rounded, level: 'A1 - B2', description: 'Luyện tập, trận đấu và hoạt động giải trí.'),
  Topic(id: 'media', title: 'Media & Culture', titleVi: 'Truyền thông & văn hóa', icon: Icons.movie_creation_rounded, level: 'A2 - B2', description: 'Phim ảnh, tin tức, mạng xã hội và văn hóa.'),
  Topic(id: 'emotions', title: 'Emotions', titleVi: 'Cảm xúc & tính cách', icon: Icons.mood_rounded, level: 'A1 - B2', description: 'Cảm xúc, thái độ và phẩm chất cá nhân.'),
  Topic(id: 'phrasal', title: 'Phrasal Verbs', titleVi: 'Cụm động từ', icon: Icons.extension_rounded, level: 'B1 - B2', description: 'Cụm động từ thường gặp trong giao tiếp.'),
  Topic(id: 'idioms', title: 'Idioms', titleVi: 'Thành ngữ', icon: Icons.lightbulb_rounded, level: 'B1 - B2', description: 'Thành ngữ thông dụng trong nói và đọc hiểu.'),
  Topic(id: 'testprep', title: 'Exam Prep', titleVi: 'Ôn thi tiếng Anh', icon: Icons.quiz_rounded, level: 'A2 - B2', description: 'Từ vựng học thuật và kỹ năng làm bài.'),
];

final vocabRows = <String, List<List<String>>>{
  'everyday': [
    ['Routine', 'Thói quen hằng ngày', '/ruːˈtiːn/', 'My daily ___ starts with a short walk.', 'A2', 'Kỳ nghỉ|Bài kiểm tra|Món tráng miệng'],
    ['Neighbourhood', 'Khu xóm', '/ˈneɪ.bə.hʊd/', 'Our ___ is quiet and friendly.', 'A2', 'Sân bay|Nhà máy|Phòng họp'],
    ['Appliance', 'Thiết bị gia dụng', '/əˈplaɪ.əns/', 'A washing machine is a useful ___.', 'B1', 'Môn học|Đồ uống|Hợp đồng'],
    ['Leisure', 'Thời gian rảnh', '/ˈleʒ.ər/', 'Reading is my favorite ___ activity.', 'B1', 'Áp lực|Bệnh viện|Hóa đơn'],
    ['Chore', 'Việc nhà lặt vặt', '/tʃɔːr/', 'Taking out the trash is a household ___.', 'A2', 'Chuyến bay|Lễ hội|Mức lương'],
    ['Convenient', 'Tiện lợi', '/kənˈviː.ni.ənt/', 'Online payment is very ___.', 'A2', 'Đắng|Nguy hiểm|Bí mật'],
    ['Grateful', 'Biết ơn', '/ˈɡreɪt.fəl/', 'I am ___ for your support.', 'A2', 'Tức giận|Ồn ào|Đắt đỏ'],
    ['Punctual', 'Đúng giờ', '/ˈpʌŋk.tʃu.əl/', 'Please be ___ for the appointment.', 'B1', 'Muộn|Mặn|Bị hỏng'],
    ['Commute', 'Đi lại hằng ngày', '/kəˈmjuːt/', 'My ___ takes forty minutes by bus.', 'B1', 'Bữa sáng|Đơn thuốc|Bản nhạc'],
    ['Errand', 'Việc vặt bên ngoài', '/ˈer.ənd/', 'I have to run an ___ after lunch.', 'B1', 'Học bổng|Sân vận động|Bản hợp đồng'],
  ],
  'school': [
    ['Assignment', 'Bài tập được giao', '/əˈsaɪn.mənt/', 'The teacher gave us a new ___.', 'A2', 'Sân bay|Hóa đơn|Bữa ăn'],
    ['Lecture', 'Bài giảng', '/ˈlek.tʃər/', 'The history ___ was interesting.', 'B1', 'Khách sạn|Triệu chứng|Hợp đồng'],
    ['Scholarship', 'Học bổng', '/ˈskɑː.lɚ.ʃɪp/', 'She won a ___ to study abroad.', 'B1', 'Tiền phạt|Vé tàu|Đơn thuốc'],
    ['Textbook', 'Sách giáo khoa', '/ˈtekst.bʊk/', 'Open your ___ to page ten.', 'A1', 'Bàn chải|Hộ chiếu|Bảo hành'],
    ['Classmate', 'Bạn cùng lớp', '/ˈklæs.meɪt/', 'My ___ helped me with math.', 'A1', 'Khách hàng|Bác sĩ|Đầu bếp'],
    ['Subject', 'Môn học', '/ˈsʌb.dʒekt/', 'English is my favorite ___.', 'A1', 'Hương vị|Thiết bị|Chuyến đi'],
    ['Improve', 'Cải thiện', '/ɪmˈpruːv/', 'Practice can ___ your speaking.', 'A2', 'Hủy bỏ|Che giấu|Giảm giá'],
    ['Research', 'Nghiên cứu', '/rɪˈsɝːtʃ/', 'We did ___ for our project.', 'B1', 'Giải trí|Tập thể dục|Mua hàng'],
    ['Semester', 'Học kỳ', '/səˈmes.tɚ/', 'The new ___ begins in September.', 'B1', 'Biên lai|Món khai vị|Huy chương'],
    ['Fluent', 'Lưu loát', '/ˈfluː.ənt/', 'She is ___ in English.', 'B1', 'Đầy bụi|Đang giảm|Bị khóa'],
  ],
  'work': [
    ['Deadline', 'Hạn chót', '/ˈded.laɪn/', 'We must finish before the ___.', 'B1', 'Kỳ nghỉ|Triệu chứng|Món tráng miệng'],
    ['Colleague', 'Đồng nghiệp', '/ˈkɑː.liːɡ/', 'My ___ sits next to me.', 'A2', 'Bạn cùng lớp|Hành khách|Bệnh nhân'],
    ['Meeting', 'Cuộc họp', '/ˈmiː.tɪŋ/', 'The ___ starts at nine.', 'A1', 'Bữa sáng|Kỳ thi|Chuyến bay'],
    ['Manager', 'Quản lý', '/ˈmæn.ɪ.dʒɚ/', 'The ___ approved the plan.', 'A2', 'Phi công|Y tá|Hướng dẫn viên'],
    ['Salary', 'Lương', '/ˈsæl.ɚ.i/', 'Her ___ increased this year.', 'A2', 'Bài giảng|Hộ chiếu|Thành phần'],
    ['Promotion', 'Sự thăng chức', '/prəˈmoʊ.ʃən/', 'He got a ___ after two years.', 'B1', 'Sự hoãn chuyến|Cơn đau|Lời khuyên'],
    ['Client', 'Khách hàng', '/ˈklaɪ.ənt/', 'The ___ requested a report.', 'B1', 'Giáo viên|Hành lý|Đầu bếp'],
    ['Efficient', 'Hiệu quả', '/ɪˈfɪʃ.ənt/', 'This system is fast and ___.', 'B2', 'Ngon miệng|Đau đớn|Lạc đường'],
    ['Collaborate', 'Hợp tác', '/kəˈlæb.ə.reɪt/', 'Teams ___ on the same document.', 'B2', 'Ghen tị|Rò rỉ|Nếm thử'],
    ['Workload', 'Khối lượng công việc', '/ˈwɝːk.loʊd/', 'My ___ is heavy this week.', 'B2', 'Mùi vị|Hành lý|Thực đơn'],
  ],
  'travel': [
    ['Destination', 'Điểm đến', '/ˌdes.təˈneɪ.ʃən/', 'Paris is our next ___.', 'A2', 'Hóa đơn|Triệu chứng|Từ điển'],
    ['Luggage', 'Hành lý', '/ˈlʌɡ.ɪdʒ/', 'My ___ is very heavy.', 'A2', 'Bài tập|Đơn thuốc|Mức lương'],
    ['Reservation', 'Sự đặt chỗ', '/ˌrez.ɚˈveɪ.ʃən/', 'I made a hotel ___.', 'B1', 'Sự thăng chức|Cơn đau|Món ăn'],
    ['Itinerary', 'Lịch trình chuyến đi', '/aɪˈtɪn.ə.rer.i/', 'Our ___ includes three cities.', 'B1', 'Công thức nấu ăn|Bài kiểm tra|Hợp đồng'],
    ['Departure', 'Sự khởi hành', '/dɪˈpɑːr.tʃɚ/', 'The ___ time is 7 a.m.', 'B1', 'Bữa trưa|Cuộc họp|Đơn hàng'],
    ['Accommodation', 'Chỗ ở', '/əˌkɑː.məˈdeɪ.ʃən/', 'We found cheap ___.', 'B1', 'Bài giảng|Thiết bị|Triệu chứng'],
    ['Tourist', 'Khách du lịch', '/ˈtʊr.ɪst/', 'The ___ asked for directions.', 'A1', 'Bệnh nhân|Quản lý|Đồng nghiệp'],
    ['Explore', 'Khám phá', '/ɪkˈsplɔːr/', 'We want to ___ the old town.', 'A2', 'In ấn|Nghỉ ốm|Thanh toán'],
    ['Souvenir', 'Quà lưu niệm', '/ˌsuː.vəˈnɪr/', 'I bought a ___ for my sister.', 'B1', 'Vắc xin|Học kỳ|Mật khẩu'],
    ['Currency', 'Tiền tệ', '/ˈkɝː.ən.si/', 'You should exchange ___ before traveling.', 'B1', 'Chỗ ngồi|Thời tiết|Cảm xúc'],
  ],
  'food': [
    ['Ingredient', 'Nguyên liệu', '/ɪnˈɡriː.di.ənt/', 'Tomato is the main ___.', 'A2', 'Hành lý|Màn hình|Học bổng'],
    ['Delicious', 'Ngon', '/dɪˈlɪʃ.əs/', 'This soup is ___.', 'A1', 'Đau|Đắt|Muộn'],
    ['Appetizer', 'Món khai vị', '/ˈæp.ə.taɪ.zɚ/', 'We ordered an ___ first.', 'B1', 'Môn học|Hợp đồng|Cổng sân bay'],
    ['Beverage', 'Đồ uống', '/ˈbev.ɚ.ɪdʒ/', 'Tea is a popular ___.', 'B1', 'Thiết bị|Nơi ở|Nhiệm vụ'],
    ['Recipe', 'Công thức nấu ăn', '/ˈres.ə.pi/', 'I followed the ___ carefully.', 'A2', 'Lịch trình|Bài giảng|Đơn thuốc'],
    ['Flavor', 'Hương vị', '/ˈfleɪ.vɚ/', 'The ___ is sweet and fresh.', 'A2', 'Mức lương|Địa chỉ|Triệu chứng'],
    ['Spicy', 'Cay', '/ˈspaɪ.si/', 'This curry is too ___.', 'A1', 'Lạnh|Im lặng|Chính xác'],
    ['Dessert', 'Món tráng miệng', '/dɪˈzɝːt/', 'Ice cream is my favorite ___.', 'A1', 'Văn phòng|Bài tập|Hóa đơn'],
    ['Nutritious', 'Bổ dưỡng', '/nuːˈtrɪʃ.əs/', 'Vegetables are very ___.', 'B1', 'Ồn ào|Rỗng|Xa xôi'],
    ['Takeaway', 'Đồ ăn mang đi', '/ˈteɪk.ə.weɪ/', 'We ordered ___ tonight.', 'B1', 'Nghiên cứu|Lịch trình|Tái chế'],
  ],
  'tech': [
    ['Device', 'Thiết bị', '/dɪˈvaɪs/', 'A phone is a useful ___.', 'A2', 'Món ăn|Học bổng|Triệu chứng'],
    ['Software', 'Phần mềm', '/ˈsɑːft.wer/', 'This ___ helps edit photos.', 'A2', 'Hành lý|Công thức|Đơn thuốc'],
    ['Password', 'Mật khẩu', '/ˈpæs.wɝːd/', 'Never share your ___.', 'A2', 'Hóa đơn|Món tráng miệng|Điểm đến'],
    ['Connection', 'Kết nối', '/kəˈnek.ʃən/', 'The internet ___ is slow.', 'B1', 'Mùi vị|Cơn đau|Đường bay'],
    ['Privacy', 'Quyền riêng tư', '/ˈpraɪ.və.si/', 'Online ___ is important.', 'B1', 'Khai vị|Đúng giờ|Học phí'],
    ['Search Engine', 'Công cụ tìm kiếm', '/sɝːtʃ ˈen.dʒɪn/', 'Google is a ___.', 'A2', 'Sổ tay|Bệnh viện|Quầy lễ tân'],
    ['Artificial Intelligence', 'Trí tuệ nhân tạo', '/ˌɑːr.t̬əˈfɪʃ.əl ɪnˈtel.ə.dʒəns/', '___ can support learning.', 'B2', 'Đồ uống nóng|Hành lý ký gửi|Việc nhà'],
    ['Cybersecurity', 'An ninh mạng', '/ˌsaɪ.bɚ.sɪˈkjʊr.ə.t̬i/', 'Companies invest in ___.', 'B2', 'Ẩm thực|Thể dục|Du lịch'],
    ['Backup', 'Sao lưu', '/ˈbæk.ʌp/', 'Make a ___ of your data.', 'B1', 'Lời xin lỗi|Đường vòng|Trận đấu'],
    ['Algorithm', 'Thuật toán', '/ˈæl.ɡə.rɪ.ðəm/', 'The ___ ranks search results.', 'B2', 'Bảo tàng|Hóa đơn|Cơn sốt'],
  ],
  'health': [
    ['Symptom', 'Triệu chứng', '/ˈsɪmp.təm/', 'Fever is a common ___.', 'A2', 'Hộ chiếu|Món ăn|Bài tập'],
    ['Appointment', 'Cuộc hẹn', '/əˈpɔɪnt.mənt/', 'I have a doctor ___ tomorrow.', 'A2', 'Hợp đồng|Lịch bay|Công thức'],
    ['Medicine', 'Thuốc', '/ˈmed.ə.sən/', 'Take this ___ twice a day.', 'A1', 'Mật khẩu|Hành lý|Học bổng'],
    ['Exercise', 'Tập thể dục', '/ˈek.sɚ.saɪz/', 'Daily ___ improves health.', 'A1', 'Bảo hành|Thực đơn|Bài giảng'],
    ['Nutrition', 'Dinh dưỡng', '/nuːˈtrɪʃ.ən/', 'Good ___ is essential.', 'B1', 'Khởi hành|Hợp đồng|Bài hát'],
    ['Recover', 'Hồi phục', '/rɪˈkʌv.ɚ/', 'She needs time to ___.', 'B1', 'Đặt bàn|Tải xuống|Tái chế'],
    ['Injury', 'Chấn thương', '/ˈɪn.dʒɚ.i/', 'He had a knee ___.', 'A2', 'Học kỳ|Biên lai|Địa chỉ'],
    ['Treatment', 'Sự điều trị', '/ˈtriːt.mənt/', 'The ___ was successful.', 'B1', 'Khuyến mãi|Chuyến tham quan|Bản nhạc'],
    ['Prescription', 'Đơn thuốc', '/prɪˈskrɪp.ʃən/', 'The doctor wrote a ___.', 'B1', 'Bản đồ|Món tráng miệng|Lịch học'],
    ['Mental Health', 'Sức khỏe tinh thần', '/ˈmen.təl helθ/', 'Sleep supports good ___.', 'B2', 'Thẻ lên máy bay|Thực đơn|Mã giảm giá'],
  ],
  'business': [
    ['Revenue', 'Doanh thu', '/ˈrev.ə.nuː/', 'The company revenue increased.', 'B2', 'Hành lý|Triệu chứng|Món ăn'],
    ['Profit', 'Lợi nhuận', '/ˈprɑː.fɪt/', 'The store made a big ___.', 'B1', 'Bài giảng|Bệnh viện|Hương vị'],
    ['Contract', 'Hợp đồng', '/ˈkɑːn.trækt/', 'They signed a new ___.', 'B1', 'Hộ chiếu|Món tráng miệng|Lịch bay'],
    ['Negotiate', 'Đàm phán', '/nəˈɡoʊ.ʃi.eɪt/', 'We need to ___ the price.', 'B2', 'Nấu ăn|Khám bệnh|Tái chế'],
    ['Investment', 'Khoản đầu tư', '/ɪnˈvest.mənt/', 'The startup received an ___.', 'B2', 'Món khai vị|Kỳ thi|Cơn ho'],
    ['Strategy', 'Chiến lược', '/ˈstræt̬.ə.dʒi/', 'Our marketing ___ is clear.', 'B2', 'Biên lai|Hành trình|Mật khẩu'],
    ['Invoice', 'Hóa đơn', '/ˈɪn.vɔɪs/', 'Please send the ___ today.', 'B1', 'Đơn thuốc|Bài hát|Học bổng'],
    ['Brand', 'Thương hiệu', '/brænd/', 'This ___ is popular with teens.', 'B1', 'Địa chỉ|Triệu chứng|Cửa lên máy bay'],
    ['Supplier', 'Nhà cung cấp', '/səˈplaɪ.ɚ/', 'We changed our main ___.', 'B1', 'Du khách|Gia sư|Vận động viên'],
    ['Partnership', 'Quan hệ đối tác', '/ˈpɑːrt.nɚ.ʃɪp/', 'The companies formed a ___.', 'B2', 'Học bổng|Lời nhắc|Món khai vị'],
  ],
  'shopping': [
    ['Receipt', 'Biên lai', '/rɪˈsiːt/', 'Keep the ___ after paying.', 'A2', 'Triệu chứng|Hộ chiếu|Bài giảng'],
    ['Discount', 'Giảm giá', '/ˈdɪs.kaʊnt/', 'This jacket has a 20 percent ___.', 'A2', 'Cơn đau|Lịch trình|Bài tập'],
    ['Refund', 'Hoàn tiền', '/ˈriː.fʌnd/', 'I asked for a ___.', 'B1', 'Điểm đến|Món chính|Cơn sốt'],
    ['Warranty', 'Bảo hành', '/ˈwɔːr.ən.t̬i/', 'The laptop has a two-year ___.', 'B1', 'Gia vị|Học kỳ|Mức lương'],
    ['Bargain', 'Món hời', '/ˈbɑːr.ɡən/', 'This phone case is a ___.', 'B1', 'Bài luận|Hành lý|Triệu chứng'],
    ['Checkout', 'Quầy thanh toán', '/ˈtʃek.aʊt/', 'Please pay at the ___.', 'A2', 'Phòng khám|Sân bóng|Lịch bay'],
    ['Cart', 'Giỏ hàng', '/kɑːrt/', 'Add the item to your ___.', 'A1', 'Hợp đồng|Công thức|Bệnh nhân'],
    ['Exchange', 'Đổi hàng', '/ɪksˈtʃeɪndʒ/', 'Can I ___ this shirt?', 'A2', 'Tốt nghiệp|Điều trị|Tái chế'],
    ['Affordable', 'Giá phải chăng', '/əˈfɔːr.də.bəl/', 'The shoes are stylish and ___.', 'B1', 'Cay|Bị hoãn|Mệt mỏi'],
    ['Delivery', 'Giao hàng', '/dɪˈlɪv.ɚ.i/', 'Free ___ is available.', 'A2', 'Học bổng|Kỳ thi|Triệu chứng'],
  ],
  'environment': [
    ['Recycle', 'Tái chế', '/ˌriːˈsaɪ.kəl/', 'We should ___ plastic bottles.', 'A2', 'Tuyển dụng|Nếm thử|Đặt phòng'],
    ['Pollution', 'Ô nhiễm', '/pəˈluː.ʃən/', 'Air ___ harms our health.', 'B1', 'Học bổng|Món ăn|Sự thăng chức'],
    ['Climate', 'Khí hậu', '/ˈklaɪ.mət/', 'The ___ is changing quickly.', 'B1', 'Biên lai|Bài giảng|Hương vị'],
    ['Renewable', 'Có thể tái tạo', '/rɪˈnuː.ə.bəl/', 'Solar power is a ___ energy source.', 'B2', 'Cay|Bị khóa|Tạm thời'],
    ['Wildlife', 'Động vật hoang dã', '/ˈwaɪld.laɪf/', 'The park protects ___.', 'B1', 'Lương|Mật khẩu|Món khai vị'],
    ['Conserve', 'Bảo tồn', '/kənˈsɝːv/', 'We must ___ water.', 'B2', 'Hoàn tiền|Thuyết trình|Nấu nướng'],
    ['Waste', 'Rác thải', '/weɪst/', 'Reduce food ___ at home.', 'A2', 'Môn học|Đơn thuốc|Chuyến bay'],
    ['Ecosystem', 'Hệ sinh thái', '/ˈiː.koʊˌsɪs.təm/', 'A forest is a complex ___.', 'B2', 'Hóa đơn|Món ăn|Bảo hành'],
    ['Sustainable', 'Bền vững', '/səˈsteɪ.nə.bəl/', 'We need ___ solutions.', 'B2', 'Đầy bụi|Rất cay|Bị trễ'],
    ['Habitat', 'Môi trường sống', '/ˈhæb.ə.tæt/', 'Bamboo forests are a panda habitat.', 'B1', 'Hóa đơn|Bài tập|Khuôn viên'],
  ],
  'sports': [
    ['Athlete', 'Vận động viên', '/ˈæθ.liːt/', 'The ___ trains every morning.', 'A2', 'Bác sĩ|Hành lý|Món ăn'],
    ['Tournament', 'Giải đấu', '/ˈtʊr.nə.mənt/', 'Our team joined a local ___.', 'B1', 'Bài giảng|Hóa đơn|Triệu chứng'],
    ['Coach', 'Huấn luyện viên', '/koʊtʃ/', 'The ___ explained the plan.', 'A2', 'Đầu bếp|Gia sư|Phi công'],
    ['Stamina', 'Sức bền', '/ˈstæm.ə.nə/', 'Running improves your ___.', 'B2', 'Hương vị|Mật khẩu|Biên lai'],
    ['Warm Up', 'Khởi động', '/wɔːrm ʌp/', 'Always ___ before exercise.', 'A2', 'Hoàn tiền|Nộp bài|Đặt bàn'],
    ['Score', 'Ghi điểm', '/skɔːr/', 'He tried to ___ in the final minute.', 'A1', 'Nấu ăn|Tái chế|Tuyển dụng'],
    ['Spectator', 'Khán giả', '/ˈspek.teɪ.t̬ɚ/', 'Every ___ cheered loudly.', 'B1', 'Bệnh nhân|Nhân viên|Hành khách'],
    ['Hobby', 'Sở thích', '/ˈhɑː.bi/', 'Photography is my favorite ___.', 'A1', 'Hạn chót|Cơn đau|Thị phần'],
    ['Competition', 'Cuộc thi', '/ˌkɑːm.pəˈtɪʃ.ən/', 'The ___ was exciting.', 'B1', 'Món súp|Phòng khám|Mật khẩu'],
    ['Victory', 'Chiến thắng', '/ˈvɪk.tɚ.i/', 'The team celebrated a big ___.', 'B1', 'Lỗi phần mềm|Hóa đơn|Kỳ nghỉ'],
  ],
  'media': [
    ['Headline', 'Tiêu đề tin', '/ˈhed.laɪn/', 'The ___ was shocking.', 'B1', 'Hóa đơn|Đơn thuốc|Hành lý'],
    ['Podcast', 'Chương trình âm thanh', '/ˈpɑːd.kæst/', 'I listen to an English ___ daily.', 'A2', 'Thực đơn|Bài thuốc|Lịch bay'],
    ['Episode', 'Tập phim', '/ˈep.ə.soʊd/', 'The final ___ was emotional.', 'A2', 'Khẩu phần|Học kỳ|Bảo hành'],
    ['Audience', 'Khán giả', '/ˈɑː.di.əns/', 'The ___ laughed at the joke.', 'B1', 'Bệnh nhân|Nhà đầu tư|Phi công'],
    ['Review', 'Bài đánh giá', '/rɪˈvjuː/', 'Read the movie ___ first.', 'B1', 'Học bổng|Cơn đau|Bài tập'],
    ['Influencer', 'Người có ảnh hưởng', '/ˈɪn.flu.ən.sɚ/', 'The ___ promoted the product.', 'B2', 'Y tá|Hành khách|Vận động viên'],
    ['Stream', 'Phát trực tuyến', '/striːm/', 'We can ___ the concert online.', 'B1', 'Đổi hàng|Tốt nghiệp|Khám bệnh'],
    ['Culture', 'Văn hóa', '/ˈkʌl.tʃɚ/', 'Food is part of local ___.', 'A2', 'Hóa đơn|Mật khẩu|Cơn sốt'],
    ['Subtitle', 'Phụ đề', '/ˈsʌbˌtaɪ.t̬əl/', 'Turn on English ___.', 'B1', 'Bảo hành|Hành lý|Món chính'],
    ['Viral', 'Lan truyền nhanh', '/ˈvaɪ.rəl/', 'The video went ___ overnight.', 'B2', 'Bổ dưỡng|Bị hỏng|Rất cũ'],
  ],
  'emotions': [
    ['Confident', 'Tự tin', '/ˈkɑːn.fə.dənt/', 'She felt ___ before the interview.', 'A2', 'Đói|Bị khóa|Cay'],
    ['Anxious', 'Lo lắng', '/ˈæŋk.ʃəs/', 'He was ___ about the exam.', 'B1', 'Ngọt|Rẻ|Sạch'],
    ['Curious', 'Tò mò', '/ˈkjʊr.i.əs/', 'Children are naturally ___.', 'A2', 'Rỗng|Muộn|Mặn'],
    ['Patient', 'Kiên nhẫn', '/ˈpeɪ.ʃənt/', 'A good teacher is ___.', 'A2', 'Bệnh nhân|Biên lai|Món phụ'],
    ['Reliable', 'Đáng tin cậy', '/rɪˈlaɪ.ə.bəl/', 'He is a ___ friend.', 'B1', 'Cay|Lạc đường|Bị hoãn'],
    ['Generous', 'Hào phóng', '/ˈdʒen.ə.rəs/', 'She is ___ with her time.', 'B1', 'Keo kiệt|Bị khóa|Đầy bụi'],
    ['Embarrassed', 'Xấu hổ', '/ɪmˈber.əst/', 'I felt ___ after the mistake.', 'B1', 'Tự hào|Đúng giờ|Bổ dưỡng'],
    ['Proud', 'Tự hào', '/praʊd/', 'His parents were ___ of him.', 'A2', 'Đói|Bị lỗi|Lạnh'],
    ['Calm', 'Bình tĩnh', '/kɑːm/', 'Stay ___ during the test.', 'A2', 'Ồn ào|Bị hỏng|Cay'],
    ['Empathy', 'Sự đồng cảm', '/ˈem.pə.θi/', 'Great leaders show ___.', 'B2', 'Mật khẩu|Hóa đơn|Học kỳ'],
  ],
  'phrasal': [
    ['Look Up', 'Tra cứu', '/lʊk ʌp/', 'Please ___ the new word.', 'B1', 'Vứt bỏ|Hoãn lại|Tăng tốc'],
    ['Give Up', 'Từ bỏ', '/ɡɪv ʌp/', 'Do not ___ after one mistake.', 'B1', 'Tra cứu|Mặc thử|Đăng nhập'],
    ['Set Up', 'Thiết lập', '/set ʌp/', 'We need to ___ the account.', 'B1', 'Hủy bỏ|Nếm thử|Bảo tồn'],
    ['Run Out Of', 'Cạn kiệt', '/rʌn aʊt əv/', 'We may ___ time.', 'B1', 'Chăm sóc|Ghé qua|Tắt'],
    ['Turn On', 'Bật lên', '/tɝːn ɑːn/', 'Please ___ the light.', 'A2', 'Tắt đi|Từ bỏ|Gặp gỡ'],
    ['Turn Off', 'Tắt đi', '/tɝːn ɔːf/', '___ your phone in class.', 'A2', 'Bật lên|Đón ai|Tra cứu'],
    ['Pick Up', 'Đón ai đó', '/pɪk ʌp/', 'Can you ___ me at six?', 'A2', 'Từ bỏ|Hủy bỏ|Cạn kiệt'],
    ['Put Off', 'Trì hoãn', '/pʊt ɔːf/', 'They ___ the meeting.', 'B1', 'Bắt đầu|Tăng giá|Nếm thử'],
    ['Find Out', 'Tìm ra', '/faɪnd aʊt/', 'I want to ___ the truth.', 'B1', 'Bỏ cuộc|Tắt đi|Đặt bàn'],
    ['Log In', 'Đăng nhập', '/lɔːɡ ɪn/', '___ with your password.', 'A2', 'Đăng xuất|Nấu ăn|Điều trị'],
  ],
  'idioms': [
    ['Break The Ice', 'Phá vỡ sự ngại ngùng ban đầu', '/breɪk ði aɪs/', 'A joke can ___.', 'B1', 'Làm vỡ kính|Tắt đèn|Giảm giá'],
    ['Piece Of Cake', 'Rất dễ', '/piːs əv keɪk/', 'The test was a ___.', 'B1', 'Món tráng miệng|Bài khó|Lịch trình'],
    ['Once In A Blue Moon', 'Rất hiếm khi', '/wʌns ɪn ə bluː muːn/', 'He visits us ___.', 'B1', 'Mỗi ngày|Rất nhanh|Tốn kém'],
    ['Hit The Books', 'Học chăm chỉ', '/hɪt ðə bʊks/', 'I need to ___ tonight.', 'B1', 'Đánh sách|Đi mua sắm|Nấu ăn'],
    ['Under The Weather', 'Không khỏe', '/ˈʌn.dɚ ðə ˈweð.ɚ/', 'I feel ___.', 'B1', 'Dưới trời mưa|Rất vui|Đúng giờ'],
    ['Call It A Day', 'Dừng làm việc trong ngày', '/kɔːl ɪt ə deɪ/', 'We should ___ and go home.', 'B1', 'Gọi điện|Bắt đầu học|Đi du lịch'],
    ['On The Same Page', 'Cùng hiểu như nhau', '/ɑːn ðə seɪm peɪdʒ/', 'Make sure we are ___.', 'B2', 'Ở cùng trang giấy|Lạc đường|Đói bụng'],
    ['Spill The Beans', 'Tiết lộ bí mật', '/spɪl ðə biːnz/', 'Do not ___ about the party.', 'B1', 'Làm đổ đậu|Nấu ăn|Tái chế'],
    ['Keep An Eye On', 'Để mắt tới', '/kiːp ən aɪ ɑːn/', 'Please ___ my bag.', 'B1', 'Giữ một con mắt|Đóng cửa|Đặt bàn'],
    ['Miss The Boat', 'Bỏ lỡ cơ hội', '/mɪs ðə boʊt/', 'Apply now or you may ___.', 'B2', 'Lỡ chuyến tàu|Đi du lịch|Bị bệnh'],
  ],
  'testprep': [
    ['Analyze', 'Phân tích', '/ˈæn.əl.aɪz/', 'You should ___ the chart first.', 'B1', 'Nếm thử|Đặt bàn|Khởi động'],
    ['Compare', 'So sánh', '/kəmˈper/', '___ the two opinions.', 'A2', 'Tái chế|Điều trị|Đổi hàng'],
    ['Summarize', 'Tóm tắt', '/ˈsʌm.ə.raɪz/', 'Please ___ the passage.', 'B1', 'Nấu ăn|Hủy bỏ|Giao hàng'],
    ['Evidence', 'Bằng chứng', '/ˈev.ə.dəns/', 'Use ___ to support your answer.', 'B1', 'Gia vị|Hành lý|Cơn sốt'],
    ['Conclusion', 'Kết luận', '/kənˈkluː.ʒən/', 'Write a clear ___.', 'B1', 'Món chính|Mật khẩu|Đơn thuốc'],
    ['Diagram', 'Sơ đồ', '/ˈdaɪ.ə.ɡræm/', 'Label the ___ carefully.', 'A2', 'Hóa đơn|Thực đơn|Lịch bay'],
    ['Trend', 'Xu hướng', '/trend/', 'The graph shows an upward ___.', 'B1', 'Cơn ho|Học bổng|Bảo hành'],
    ['Fluctuate', 'Dao động', '/ˈflʌk.tʃu.eɪt/', 'Prices may ___ during the year.', 'B2', 'Đăng nhập|Ăn tối|Khám bệnh'],
    ['Accurate', 'Chính xác', '/ˈæk.jɚ.ət/', 'Make sure your answer is ___.', 'B1', 'Ngọt|Muộn|Đầy bụi'],
    ['Inference', 'Suy luận', '/ˈɪn.fɚ.əns/', 'This question asks for an ___.', 'B2', 'Biên lai|Món phụ|Cảm xúc'],
  ],
};

final vocabData = vocabRows.entries.expand((entry) {
  return List.generate(entry.value.length, (index) {
    final row = entry.value[index];
    return VocabWord(
      id: '${entry.key}_${index + 1}',
      word: row[0],
      meaning: row[1],
      pronunciation: row[2],
      example: row[3],
      topicId: entry.key,
      level: row[4],
      wrongOptions: row[5].split('|'),
    );
  });
}).toList();

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key, required this.onThemeChanged});

  final ValueChanged<bool> onThemeChanged;

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  static const progressKey = 'quiz_vocab_progress_v3';
  static const soundKey = 'quiz_vocab_sound';
  static const autoSpeakKey = 'quiz_vocab_auto_speak';
  static const darkModeKey = 'quiz_vocab_dark_mode';

  SharedPreferences? prefs;
  UserProgress progress = UserProgress();
  bool soundEnabled = true;
  bool autoSpeak = true;
  bool darkMode = false;
  int selectedIndex = 0;
  List<QuizQuestion>? activeQuestions;
  String activeTopicId = 'general';
  String activeTopicTitle = 'Quiz Vocab';
  QuizResultData? lastResult;
  final FlutterTts tts = FlutterTts();

  @override
  void initState() {
    super.initState();
    _loadState();
    tts.setLanguage('en-US');
    tts.setSpeechRate(0.45);
  }

  Future<void> _loadState() async {
    final loadedPrefs = await SharedPreferences.getInstance();
    final raw = loadedPrefs.getString(progressKey);
    final loadedProgress = raw == null ? UserProgress() : UserProgress.fromJson(jsonDecode(raw) as Map<String, dynamic>);
    _updateStreak(loadedProgress);

    setState(() {
      prefs = loadedPrefs;
      progress = loadedProgress;
      soundEnabled = loadedPrefs.getBool(soundKey) ?? true;
      autoSpeak = loadedPrefs.getBool(autoSpeakKey) ?? true;
      darkMode = loadedPrefs.getBool(darkModeKey) ?? false;
    });
    widget.onThemeChanged(darkMode);
    await _saveProgress();
  }

  void _updateStreak(UserProgress data) {
    final today = todayString();
    if (data.lastActiveDate == today) return;
    final last = DateTime.tryParse(data.lastActiveDate);
    final now = DateTime.now();
    if (last == null) {
      data.streakDays = 1;
    } else {
      final diff = DateTime(now.year, now.month, now.day).difference(DateTime(last.year, last.month, last.day)).inDays;
      data.streakDays = diff == 1 ? data.streakDays + 1 : 1;
    }
    data.lastActiveDate = today;
  }

  Future<void> _saveProgress() async {
    await prefs?.setString(progressKey, jsonEncode(progress.toJson()));
  }

  Future<void> _saveSettings() async {
    await prefs?.setBool(soundKey, soundEnabled);
    await prefs?.setBool(autoSpeakKey, autoSpeak);
    await prefs?.setBool(darkModeKey, darkMode);
  }

  List<QuizQuestion> _generateQuestions(List<VocabWord> words) {
    final random = Random();
    final pairs = <MapEntry<VocabWord, QuestionType>>[];
    final shuffledWords = [...words]..shuffle(random);
    for (final word in shuffledWords) {
      for (final type in QuestionType.values) {
        pairs.add(MapEntry(word, type));
      }
    }
    pairs.shuffle(random);
    return pairs.take(min(20, pairs.length)).toList().asMap().entries.map((entry) {
      return _questionFromPair(entry.value.key, entry.value.value, entry.key, random);
    }).toList();
  }

  QuizQuestion _questionFromPair(VocabWord word, QuestionType type, int index, Random random) {
    final pool = [...vocabData]..shuffle(random);
    final fullSentence = word.example.replaceAll('___', word.word);
    final blankSentence = word.example.contains('___') ? word.example : word.example.replaceAll(RegExp(word.word, caseSensitive: false), '___');

    if (type == QuestionType.meaning || type == QuestionType.context) {
      final options = _makeOptions(word.meaning, word.wrongOptions, random);
      return QuizQuestion(
        id: '${word.id}_${type.name}_$index',
        word: word,
        type: type,
        prompt: type == QuestionType.meaning ? 'Nghĩa tiếng Việt của "${word.word}" là gì?' : 'Trong câu dưới đây, "${word.word}" mang nghĩa gì?',
        subPrompt: type == QuestionType.meaning ? word.pronunciation : fullSentence,
        options: options,
        correctAnswer: word.meaning,
        explanation: '"${word.word}" có nghĩa là "${word.meaning}". Ví dụ: $fullSentence',
      );
    }

    if (type == QuestionType.reverse || type == QuestionType.pronunciation) {
      final wrong = pool.where((item) => item.id != word.id).map((item) => item.word);
      final options = _makeOptions(word.word, wrong, random);
      return QuizQuestion(
        id: '${word.id}_${type.name}_$index',
        word: word,
        type: type,
        prompt: type == QuestionType.reverse ? 'Từ tiếng Anh nào mang nghĩa "${word.meaning}"?' : 'Từ nào có phiên âm ${word.pronunciation}?',
        subPrompt: type == QuestionType.pronunciation ? 'Gợi ý nghĩa: ${word.meaning}' : null,
        options: options,
        correctAnswer: word.word,
        explanation: '"${word.meaning}" trong tiếng Anh là "${word.word}" ${word.pronunciation}.',
      );
    }

    final wrong = pool.where((item) => item.id != word.id).map((item) => item.word);
    final options = _makeOptions(word.word, wrong, random);
    return QuizQuestion(
      id: '${word.id}_${type.name}_$index',
      word: word,
      type: type,
      prompt: 'Chọn từ phù hợp để điền vào chỗ trống:',
      subPrompt: blankSentence,
      options: options,
      correctAnswer: word.word,
      explanation: 'Câu hoàn chỉnh: $fullSentence',
    );
  }

  List<String> _makeOptions(String correct, Iterable<String> wrongPool, Random random) {
    final options = <String>[correct];
    for (final option in wrongPool) {
      if (option.trim().isEmpty || option == correct || options.contains(option)) continue;
      options.add(option);
      if (options.length == 4) break;
    }
    while (options.length < 4) {
      options.add('Đáp án khác ${options.length}');
    }
    options.shuffle(random);
    return options;
  }

  void _startTopicQuiz(Topic topic) {
    final words = vocabData.where((word) => word.topicId == topic.id).toList();
    setState(() {
      activeTopicId = topic.id;
      activeTopicTitle = '${topic.title} - ${topic.titleVi}';
      activeQuestions = _generateQuestions(words);
      lastResult = null;
      selectedIndex = 1;
    });
  }

  void _startWrongWordsQuiz() {
    final wrongIds = progress.wrongWords.map((record) => record.wordId).toSet();
    final words = vocabData.where((word) => wrongIds.contains(word.id)).toList();
    if (words.isEmpty) return;
    setState(() {
      activeTopicId = 'wrong_review';
      activeTopicTitle = 'Ôn tập từ sai';
      activeQuestions = _generateQuestions(words);
      lastResult = null;
      selectedIndex = 1;
    });
  }

  Future<void> _finishQuiz(String topicId, int correctCount, List<VocabWord> wrongWords) async {
    final total = activeQuestions?.length ?? 0;
    final percent = total == 0 ? 0 : ((correctCount / total) * 100).round();

    progress.totalQuizzes += 1;
    progress.totalCorrect += correctCount;
    progress.totalQuestions += total;
    progress.highScore = max(progress.highScore, percent);

    final stat = progress.topicStats.putIfAbsent(topicId, () => TopicStat());
    stat.completedCount += 1;
    stat.highestScore = max(stat.highestScore, percent);

    for (final word in wrongWords) {
      final existing = progress.wrongWords.where((record) => record.wordId == word.id).toList();
      if (existing.isEmpty) {
        progress.wrongWords.add(WrongWordRecord(wordId: word.id, wrongCount: 1, lastWrongAt: DateTime.now().toIso8601String()));
      } else {
        existing.first.wrongCount += 1;
        existing.first.lastWrongAt = DateTime.now().toIso8601String();
      }
    }

    final result = QuizResultData(
      topicId: topicId,
      topicTitle: activeTopicTitle,
      correctCount: correctCount,
      totalQuestions: total,
      wrongWords: wrongWords,
      percent: percent,
    );

    setState(() {
      progress = progress;
      lastResult = result;
    });
    await _saveProgress();
  }

  Future<void> _removeWrongWord(String wordId) async {
    setState(() => progress.wrongWords.removeWhere((record) => record.wordId == wordId));
    await _saveProgress();
  }

  Future<void> _resetProgress() async {
    setState(() {
      progress = UserProgress();
      activeQuestions = null;
      lastResult = null;
    });
    await _saveProgress();
  }

  Future<void> _speak(String text) async {
    if (!soundEnabled) return;
    await tts.stop();
    await tts.speak(text);
  }

  @override
  Widget build(BuildContext context) {
    final screens = <Widget>[
      HomeScreen(
        progress: progress,
        onStartLearning: () => setState(() => selectedIndex = 1),
        onViewProgress: () => setState(() => selectedIndex = 3),
      ),
      activeQuestions == null
          ? TopicsScreen(progress: progress, onSelectTopic: _startTopicQuiz)
          : lastResult == null
              ? QuizScreen(
                  topicTitle: activeTopicTitle,
                  questions: activeQuestions!,
                  soundEnabled: soundEnabled,
                  autoSpeak: autoSpeak,
                  onSpeak: _speak,
                  onExit: () => setState(() => activeQuestions = null),
                  onFinish: (correct, wrong) => _finishQuiz(activeTopicId, correct, wrong),
                )
              : ResultScreen(
                  result: lastResult!,
                  onRetry: () {
                    final topic = topics.where((item) => item.id == lastResult!.topicId).toList();
                    if (topic.isEmpty) {
                      _startWrongWordsQuiz();
                    } else {
                      _startTopicQuiz(topic.first);
                    }
                  },
                  onOtherTopic: () => setState(() {
                    activeQuestions = null;
                    lastResult = null;
                  }),
                  onWrongWords: () => setState(() {
                    activeQuestions = null;
                    lastResult = null;
                    selectedIndex = 2;
                  }),
                ),
      WrongWordsScreen(records: progress.wrongWords, onRemove: _removeWrongWord, onStartQuiz: _startWrongWordsQuiz),
      ProgressScreen(progress: progress),
      SettingsScreen(
        soundEnabled: soundEnabled,
        autoSpeak: autoSpeak,
        darkMode: darkMode,
        onSoundChanged: (value) async {
          setState(() => soundEnabled = value);
          await _saveSettings();
        },
        onAutoSpeakChanged: (value) async {
          setState(() => autoSpeak = value);
          await _saveSettings();
        },
        onDarkModeChanged: (value) async {
          setState(() => darkMode = value);
          widget.onThemeChanged(value);
          await _saveSettings();
        },
        onResetProgress: _resetProgress,
      ),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quiz Vocab', style: TextStyle(fontWeight: FontWeight.w900)),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: Chip(
              avatar: const Icon(Icons.local_fire_department_rounded, size: 18),
              label: Text('${progress.streakDays} ngày'),
            ),
          ),
        ],
      ),
      body: AnimatedSwitcher(duration: const Duration(milliseconds: 250), child: screens[selectedIndex]),
      bottomNavigationBar: NavigationBar(
        selectedIndex: selectedIndex,
        onDestinationSelected: (index) {
          setState(() {
            selectedIndex = index;
            if (index != 1) {
              activeQuestions = null;
              lastResult = null;
            }
          });
        },
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_rounded), label: 'Trang chủ'),
          NavigationDestination(icon: Icon(Icons.quiz_rounded), label: 'Quiz'),
          NavigationDestination(icon: Icon(Icons.replay_rounded), label: 'Từ sai'),
          NavigationDestination(icon: Icon(Icons.bar_chart_rounded), label: 'Tiến độ'),
          NavigationDestination(icon: Icon(Icons.settings_rounded), label: 'Cài đặt'),
        ],
      ),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({
    super.key,
    required this.progress,
    required this.onStartLearning,
    required this.onViewProgress,
  });

  final UserProgress progress;
  final VoidCallback onStartLearning;
  final VoidCallback onViewProgress;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            gradient: const LinearGradient(colors: [Color(0xFF4F46E5), Color(0xFF22C55E)]),
            borderRadius: BorderRadius.circular(32),
          ),
          child: const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(Icons.menu_book_rounded, size: 56, color: Colors.white),
              SizedBox(height: 16),
              Text('Học từ vựng thông minh', style: TextStyle(fontSize: 28, color: Colors.white, fontWeight: FontWeight.w900)),
              SizedBox(height: 8),
              Text('16 chủ đề, 160 từ vựng và 5 kiểu câu hỏi để luyện hằng ngày.', style: TextStyle(color: Colors.white70, fontSize: 15)),
            ],
          ),
        ),
        const SizedBox(height: 20),
        Row(
          children: [
            Expanded(child: StatCard(title: 'Quiz', value: '${progress.totalQuizzes}', icon: Icons.quiz_rounded)),
            const SizedBox(width: 12),
            Expanded(child: StatCard(title: 'Độ chính xác', value: '${(progress.accuracy * 100).round()}%', icon: Icons.check_circle_rounded)),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(child: StatCard(title: 'Chủ đề', value: '${topics.length}', icon: Icons.category_rounded)),
            const SizedBox(width: 12),
            Expanded(child: StatCard(title: 'Từ vựng', value: '${vocabData.length}', icon: Icons.translate_rounded)),
          ],
        ),
        const SizedBox(height: 20),
        FilledButton.icon(onPressed: onStartLearning, icon: const Icon(Icons.play_arrow_rounded), label: const Text('Bắt đầu học')),
        const SizedBox(height: 12),
        OutlinedButton.icon(onPressed: onViewProgress, icon: const Icon(Icons.bar_chart_rounded), label: const Text('Xem tiến độ')),
      ],
    );
  }
}

class StatCard extends StatelessWidget {
  const StatCard({super.key, required this.title, required this.value, required this.icon});

  final String title;
  final String value;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: Theme.of(context).colorScheme.primary),
            const SizedBox(height: 12),
            Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900)),
            Text(title, style: Theme.of(context).textTheme.bodySmall),
          ],
        ),
      ),
    );
  }
}

class TopicsScreen extends StatelessWidget {
  const TopicsScreen({super.key, required this.progress, required this.onSelectTopic});

  final UserProgress progress;
  final ValueChanged<Topic> onSelectTopic;

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      padding: const EdgeInsets.all(18),
      itemCount: topics.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final topic = topics[index];
        final count = vocabData.where((word) => word.topicId == topic.id).length;
        final stat = progress.topicStats[topic.id];
        return Card(
          child: ListTile(
            contentPadding: const EdgeInsets.all(16),
            leading: CircleAvatar(child: Icon(topic.icon)),
            title: Text('${topic.title} • ${topic.titleVi}', style: const TextStyle(fontWeight: FontWeight.w800)),
            subtitle: Padding(
              padding: const EdgeInsets.only(top: 6),
              child: Text('${topic.description}\n$count từ • tối đa 20 câu/lượt • ${topic.level}${stat == null ? '' : '\nĐã học ${stat.completedCount} lần • cao nhất ${stat.highestScore}%'}'),
            ),
            isThreeLine: true,
            trailing: const Icon(Icons.chevron_right_rounded),
            onTap: () => onSelectTopic(topic),
          ),
        );
      },
    );
  }
}

class QuizScreen extends StatefulWidget {
  const QuizScreen({
    super.key,
    required this.topicTitle,
    required this.questions,
    required this.soundEnabled,
    required this.autoSpeak,
    required this.onSpeak,
    required this.onExit,
    required this.onFinish,
  });

  final String topicTitle;
  final List<QuizQuestion> questions;
  final bool soundEnabled;
  final bool autoSpeak;
  final ValueChanged<String> onSpeak;
  final VoidCallback onExit;
  final void Function(int correctCount, List<VocabWord> wrongWords) onFinish;

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  int currentIndex = 0;
  int score = 0;
  String? selected;
  bool answered = false;
  final wrongWords = <VocabWord>[];

  QuizQuestion get current => widget.questions[currentIndex];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _autoSpeak());
  }

  void _autoSpeak() {
    if (widget.soundEnabled && widget.autoSpeak) {
      widget.onSpeak(current.word.word);
    }
  }

  void _answer(String option) {
    if (answered) return;
    final isCorrect = option == current.correctAnswer;
    setState(() {
      selected = option;
      answered = true;
      if (isCorrect) {
        score += 1;
      } else {
        wrongWords.add(current.word);
      }
    });
  }

  void _next() {
    if (currentIndex + 1 >= widget.questions.length) {
      widget.onFinish(score, wrongWords);
      return;
    }
    setState(() {
      currentIndex += 1;
      selected = null;
      answered = false;
    });
    _autoSpeak();
  }

  @override
  Widget build(BuildContext context) {
    final progress = (currentIndex + 1) / widget.questions.length;
    return ListView(
      padding: const EdgeInsets.all(18),
      children: [
        Row(
          children: [
            IconButton(onPressed: widget.onExit, icon: const Icon(Icons.close_rounded)),
            Expanded(child: Text(widget.topicTitle, style: const TextStyle(fontWeight: FontWeight.w800), textAlign: TextAlign.center)),
            Chip(label: Text('$score/${widget.questions.length}')),
          ],
        ),
        const SizedBox(height: 8),
        LinearProgressIndicator(value: progress),
        const SizedBox(height: 16),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(22),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Câu ${currentIndex + 1}/${widget.questions.length}', style: Theme.of(context).textTheme.labelLarge),
                const SizedBox(height: 12),
                Text(current.prompt, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900)),
                if (current.subPrompt != null) ...[
                  const SizedBox(height: 12),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.primaryContainer,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Text(current.subPrompt!, style: TextStyle(color: Theme.of(context).colorScheme.onPrimaryContainer)),
                  ),
                ],
                const SizedBox(height: 12),
                OutlinedButton.icon(
                  onPressed: () => widget.onSpeak(current.word.word),
                  icon: const Icon(Icons.volume_up_rounded),
                  label: const Text('Nghe phát âm'),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),
        for (final option in current.options) ...[
          AnswerButton(
            option: option,
            answered: answered,
            selected: selected == option,
            correct: option == current.correctAnswer,
            onPressed: () => _answer(option),
          ),
          const SizedBox(height: 10),
        ],
        if (answered) ...[
          const SizedBox(height: 8),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Text(current.explanation ?? '', style: const TextStyle(fontWeight: FontWeight.w600)),
            ),
          ),
          const SizedBox(height: 12),
          FilledButton.icon(
            onPressed: _next,
            icon: const Icon(Icons.arrow_forward_rounded),
            label: Text(currentIndex + 1 == widget.questions.length ? 'Xem kết quả' : 'Câu tiếp theo'),
          ),
        ],
      ],
    );
  }
}

class AnswerButton extends StatelessWidget {
  const AnswerButton({
    super.key,
    required this.option,
    required this.answered,
    required this.selected,
    required this.correct,
    required this.onPressed,
  });

  final String option;
  final bool answered;
  final bool selected;
  final bool correct;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    Color? background;
    IconData? icon;
    if (answered && correct) {
      background = Colors.green.shade100;
      icon = Icons.check_circle_rounded;
    } else if (answered && selected && !correct) {
      background = Colors.red.shade100;
      icon = Icons.cancel_rounded;
    }

    return AnimatedContainer(
      duration: const Duration(milliseconds: 180),
      child: Material(
        color: background ?? Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(18),
        child: InkWell(
          borderRadius: BorderRadius.circular(18),
          onTap: answered ? null : onPressed,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            child: Row(
              children: [
                Expanded(child: Text(option, style: const TextStyle(fontWeight: FontWeight.w800))),
                if (icon != null) Icon(icon, color: correct ? Colors.green : Colors.red),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class ResultScreen extends StatelessWidget {
  const ResultScreen({
    super.key,
    required this.result,
    required this.onRetry,
    required this.onOtherTopic,
    required this.onWrongWords,
  });

  final QuizResultData result;
  final VoidCallback onRetry;
  final VoidCallback onOtherTopic;
  final VoidCallback onWrongWords;

  String get rating {
    if (result.percent >= 85) return 'Xuất sắc';
    if (result.percent >= 60) return 'Tốt';
    return 'Cần luyện thêm';
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(22),
      children: [
        Card(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                const Icon(Icons.emoji_events_rounded, size: 72, color: Colors.amber),
                const SizedBox(height: 16),
                Text(rating, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900)),
                const SizedBox(height: 8),
                Text(result.topicTitle, textAlign: TextAlign.center),
                const SizedBox(height: 16),
                Text('${result.correctCount}/${result.totalQuestions} đúng • ${result.percent}%', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
                Text('Từ sai: ${result.wrongWords.length}'),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),
        FilledButton.icon(onPressed: onRetry, icon: const Icon(Icons.refresh_rounded), label: const Text('Làm lại')),
        const SizedBox(height: 10),
        OutlinedButton.icon(onPressed: onOtherTopic, icon: const Icon(Icons.category_rounded), label: const Text('Chọn chủ đề khác')),
        const SizedBox(height: 10),
        OutlinedButton.icon(onPressed: onWrongWords, icon: const Icon(Icons.replay_rounded), label: const Text('Xem từ sai')),
      ],
    );
  }
}

class WrongWordsScreen extends StatelessWidget {
  const WrongWordsScreen({
    super.key,
    required this.records,
    required this.onRemove,
    required this.onStartQuiz,
  });

  final List<WrongWordRecord> records;
  final ValueChanged<String> onRemove;
  final VoidCallback onStartQuiz;

  @override
  Widget build(BuildContext context) {
    final words = records.map((record) {
      final found = vocabData.where((word) => word.id == record.wordId).toList();
      return MapEntry(record, found.isEmpty ? null : found.first);
    }).where((entry) => entry.value != null).toList();

    if (words.isEmpty) {
      return const Center(child: Text('Chưa có từ sai. Hãy làm quiz để bắt đầu ôn tập.'));
    }

    return ListView(
      padding: const EdgeInsets.all(18),
      children: [
        FilledButton.icon(onPressed: onStartQuiz, icon: const Icon(Icons.play_arrow_rounded), label: const Text('Làm quiz từ sai')),
        const SizedBox(height: 12),
        for (final entry in words)
          Card(
            child: ListTile(
              title: Text(entry.value!.word, style: const TextStyle(fontWeight: FontWeight.w900)),
              subtitle: Text('${entry.value!.meaning}\nSai ${entry.key.wrongCount} lần'),
              isThreeLine: true,
              trailing: IconButton(onPressed: () => onRemove(entry.key.wordId), icon: const Icon(Icons.delete_outline_rounded)),
            ),
          ),
      ],
    );
  }
}

class ProgressScreen extends StatelessWidget {
  const ProgressScreen({super.key, required this.progress});

  final UserProgress progress;

  @override
  Widget build(BuildContext context) {
    final sortedTopics = [...topics];
    return ListView(
      padding: const EdgeInsets.all(18),
      children: [
        Row(
          children: [
            Expanded(child: StatCard(title: 'Quiz đã làm', value: '${progress.totalQuizzes}', icon: Icons.quiz_rounded)),
            const SizedBox(width: 12),
            Expanded(child: StatCard(title: 'Điểm cao', value: '${progress.highScore}%', icon: Icons.star_rounded)),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(child: StatCard(title: 'Câu đúng', value: '${progress.totalCorrect}', icon: Icons.check_circle_rounded)),
            const SizedBox(width: 12),
            Expanded(child: StatCard(title: 'Từ sai', value: '${progress.wrongWords.length}', icon: Icons.replay_rounded)),
          ],
        ),
        const SizedBox(height: 20),
        const Text('Tiến độ theo chủ đề', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900)),
        const SizedBox(height: 8),
        for (final topic in sortedTopics)
          Card(
            child: ListTile(
              leading: Icon(topic.icon),
              title: Text(topic.titleVi),
              subtitle: Text('Đã học: ${progress.topicStats[topic.id]?.completedCount ?? 0} lần'),
              trailing: Text('${progress.topicStats[topic.id]?.highestScore ?? 0}%'),
            ),
          ),
      ],
    );
  }
}

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({
    super.key,
    required this.soundEnabled,
    required this.autoSpeak,
    required this.darkMode,
    required this.onSoundChanged,
    required this.onAutoSpeakChanged,
    required this.onDarkModeChanged,
    required this.onResetProgress,
  });

  final bool soundEnabled;
  final bool autoSpeak;
  final bool darkMode;
  final ValueChanged<bool> onSoundChanged;
  final ValueChanged<bool> onAutoSpeakChanged;
  final ValueChanged<bool> onDarkModeChanged;
  final VoidCallback onResetProgress;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(18),
      children: [
        SwitchListTile(
          value: soundEnabled,
          onChanged: onSoundChanged,
          title: const Text('Bật âm thanh/phát âm'),
          secondary: const Icon(Icons.volume_up_rounded),
        ),
        SwitchListTile(
          value: autoSpeak,
          onChanged: onAutoSpeakChanged,
          title: const Text('Tự đọc từ khi sang câu mới'),
          secondary: const Icon(Icons.record_voice_over_rounded),
        ),
        SwitchListTile(
          value: darkMode,
          onChanged: onDarkModeChanged,
          title: const Text('Dark mode'),
          secondary: const Icon(Icons.dark_mode_rounded),
        ),
        const Divider(),
        ListTile(
          leading: const Icon(Icons.privacy_tip_rounded),
          title: const Text('Chính sách quyền riêng tư'),
          subtitle: const Text('App không thu thập dữ liệu cá nhân. Tiến độ lưu trên thiết bị.'),
          onTap: () => showDialog<void>(
            context: context,
            builder: (context) => AlertDialog(
              title: const Text('Privacy Policy'),
              content: const SingleChildScrollView(
                child: Text('Quiz Vocab hoạt động offline, không yêu cầu đăng nhập, không thu thập tên, email, vị trí, danh bạ, ảnh hoặc dữ liệu cá nhân. Điểm số, streak và danh sách từ sai chỉ được lưu cục bộ trên thiết bị bằng SharedPreferences. Người dùng có thể xóa dữ liệu bằng nút Reset tiến độ hoặc gỡ ứng dụng.'),
              ),
              actions: [
                TextButton(onPressed: () => Navigator.pop(context), child: const Text('Đã hiểu')),
              ],
            ),
          ),
        ),
        ListTile(
          leading: const Icon(Icons.restart_alt_rounded),
          title: const Text('Reset tiến độ'),
          subtitle: const Text('Xóa điểm, streak và danh sách từ sai'),
          onTap: onResetProgress,
        ),
        const SizedBox(height: 20),
        const Center(child: Text('Quiz Vocab v1.1.0 • 16 chủ đề • 160 từ vựng')),
      ],
    );
  }
}
