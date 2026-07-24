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
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      home: MainNavigationScreen(onThemeChanged: setDarkMode),
    );
  }
}

class AppTheme {
  static ThemeData get light => ThemeData(
        useMaterial3: true,
        colorSchemeSeed: const Color(0xFF4F46E5),
        brightness: Brightness.light,
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        cardTheme: CardThemeData(
          elevation: 0,
          color: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        ),
      );

  static ThemeData get dark => ThemeData(
        useMaterial3: true,
        colorSchemeSeed: const Color(0xFF818CF8),
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF020617),
        cardTheme: CardThemeData(
          elevation: 0,
          color: const Color(0xFF0F172A),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        ),
      );
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

enum QuestionType { enToVi, viToEn, fillBlank }

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

  static WrongWordRecord fromJson(Map<String, dynamic> json) => WrongWordRecord(
        wordId: json['wordId'] as String,
        wrongCount: (json['wrongCount'] as num?)?.toInt() ?? 1,
        lastWrongAt: json['lastWrongAt'] as String? ?? DateTime.now().toIso8601String(),
      );
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
        'wrongWords': wrongWords.map((e) => e.toJson()).toList(),
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
          wrong.add(WrongWordRecord.fromJson(Map<String, dynamic>.from(item)));
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

class TopicStat {
  TopicStat({this.completedCount = 0, this.highestScore = 0});

  int completedCount;
  int highestScore;

  Map<String, dynamic> toJson() => {
        'completedCount': completedCount,
        'highestScore': highestScore,
      };

  static TopicStat fromJson(Map<String, dynamic> json) => TopicStat(
        completedCount: (json['completedCount'] as num?)?.toInt() ?? 0,
        highestScore: (json['highestScore'] as num?)?.toInt() ?? 0,
      );
}

String todayString() => DateTime.now().toIso8601String().split('T').first;

const topics = <Topic>[
  Topic(id: 'everyday', title: 'Everyday Life', titleVi: 'Cuộc sống hàng ngày', icon: Icons.wb_sunny_rounded, level: 'A1 - A2', description: 'Thói quen, nhà cửa và hoạt động thường nhật.'),
  Topic(id: 'school', title: 'School', titleVi: 'Trường học', icon: Icons.school_rounded, level: 'A1 - B1', description: 'Môn học, lớp học và dụng cụ học tập.'),
  Topic(id: 'work', title: 'Work', titleVi: 'Công việc', icon: Icons.work_rounded, level: 'A2 - B2', description: 'Văn phòng, họp hành và giao tiếp công sở.'),
  Topic(id: 'travel', title: 'Travel', titleVi: 'Du lịch', icon: Icons.flight_takeoff_rounded, level: 'A2 - B1', description: 'Sân bay, khách sạn, hỏi đường và di chuyển.'),
  Topic(id: 'food', title: 'Food', titleVi: 'Ẩm thực', icon: Icons.restaurant_rounded, level: 'A1 - A2', description: 'Món ăn, đồ uống, hương vị và nhà hàng.'),
  Topic(id: 'tech', title: 'Technology', titleVi: 'Công nghệ', icon: Icons.devices_rounded, level: 'A2 - B2', description: 'Máy tính, phần mềm, internet và thiết bị số.'),
  Topic(id: 'health', title: 'Health', titleVi: 'Sức khỏe', icon: Icons.favorite_rounded, level: 'A2 - B2', description: 'Cơ thể, triệu chứng, luyện tập và dinh dưỡng.'),
  Topic(id: 'business', title: 'Business English', titleVi: 'Tiếng Anh thương mại', icon: Icons.trending_up_rounded, level: 'B1 - B2', description: 'Tài chính, hợp đồng, tiếp thị và thương lượng.'),
];

List<VocabWord> topicWords(String topicId, List<List<String>> rows) {
  return List.generate(rows.length, (index) {
    final row = rows[index];
    return VocabWord(
      id: '${topicId}_${index + 1}',
      word: row[0],
      meaning: row[1],
      pronunciation: row[2],
      example: row[3],
      topicId: topicId,
      level: row[4],
      wrongOptions: row[5].split('|'),
    );
  });
}

final vocabData = <VocabWord>[
  ...topicWords('everyday', [
    ['Routine', 'Thói quen hằng ngày', '/ruːˈtiːn/', 'My daily ___ includes exercise and reading.', 'A2', 'Chuyến đi du lịch|Kế hoạch tài chính|Món ăn yêu thích'],
    ['Neighbourhood', 'Khu xóm', '/ˈneɪ.bə.hʊd/', 'Our ___ is quiet and safe.', 'A2', 'Sân bay|Văn phòng|Nhà hàng'],
    ['Appliance', 'Thiết bị gia dụng', '/əˈplaɪ.əns/', 'A refrigerator is a kitchen ___.', 'B1', 'Môn học|Phần mềm|Đồ uống'],
    ['Leisure', 'Thời gian rảnh rỗi', '/ˈleʒ.ər/', 'Reading is my favorite ___ activity.', 'B1', 'Áp lực|Cuộc họp|Hóa đơn'],
    ['Chore', 'Việc nhà lặt vặt', '/tʃɔːr/', 'Washing dishes is a household ___.', 'A2', 'Chuyến bay|Bài kiểm tra|Hợp đồng'],
    ['Convenient', 'Tiện lợi', '/kənˈviː.ni.ənt/', 'Living near the station is ___.', 'A2', 'Đắt đỏ|Xa xôi|Phức tạp'],
    ['Grateful', 'Biết ơn', '/ˈɡreɪt.fəl/', 'I am ___ for your help.', 'A2', 'Tức giận|Buồn ngủ|Ngạc nhiên'],
    ['Punctual', 'Đúng giờ', '/ˈpʌŋk.tʃu.əl/', 'She is always ___ for meetings.', 'B1', 'Muộn màng|Lười biếng|Ồn ào'],
    ['Commute', 'Đi lại hằng ngày', '/kəˈmjuːt/', 'My morning ___ takes thirty minutes.', 'B1', 'Bữa tối|Kỳ nghỉ|Mua sắm'],
    ['Comfortable', 'Thoải mái', '/ˈkʌmf.tə.bəl/', 'This chair is very ___.', 'A1', 'Nguy hiểm|Đắng|Bận rộn'],
  ]),
  ...topicWords('school', [
    ['Assignment', 'Bài tập được giao', '/əˈsaɪn.mənt/', 'The teacher gave us a new ___.', 'A2', 'Sân bay|Hóa đơn|Bữa ăn'],
    ['Lecture', 'Bài giảng', '/ˈlek.tʃər/', 'The history ___ was interesting.', 'B1', 'Khách sạn|Triệu chứng|Hợp đồng'],
    ['Scholarship', 'Học bổng', '/ˈskɒl.ə.ʃɪp/', 'She won a ___ to study abroad.', 'B1', 'Tiền phạt|Vé tàu|Đơn thuốc'],
    ['Textbook', 'Sách giáo khoa', '/ˈtekst.bʊk/', 'Please open your ___ to page ten.', 'A1', 'Bàn chải|Vé máy bay|Hộ chiếu'],
    ['Classmate', 'Bạn cùng lớp', '/ˈklɑːs.meɪt/', 'My ___ helped me with math.', 'A1', 'Khách hàng|Bác sĩ|Đầu bếp'],
    ['Subject', 'Môn học', '/ˈsʌb.dʒekt/', 'English is my favorite ___.', 'A1', 'Hương vị|Thiết bị|Chuyến đi'],
    ['Improve', 'Cải thiện', '/ɪmˈpruːv/', 'Practice can ___ your speaking.', 'A2', 'Hủy bỏ|Che giấu|Giảm giá'],
    ['Attend', 'Tham dự', '/əˈtend/', 'Students must ___ the exam.', 'A2', 'Nấu ăn|Đặt phòng|Sửa chữa'],
    ['Research', 'Nghiên cứu', '/rɪˈsɜːrtʃ/', 'We did ___ for our project.', 'B1', 'Giải trí|Tập thể dục|Mua hàng'],
    ['Graduate', 'Tốt nghiệp', '/ˈɡrædʒ.u.eɪt/', 'He will ___ next year.', 'B1', 'Đặt bàn|Khởi động|Hoàn tiền'],
  ]),
  ...topicWords('work', [
    ['Deadline', 'Hạn chót', '/ˈded.laɪn/', 'We must finish before the ___.', 'B1', 'Kỳ nghỉ|Triệu chứng|Món tráng miệng'],
    ['Colleague', 'Đồng nghiệp', '/ˈkɒl.iːɡ/', 'My ___ sits next to me.', 'A2', 'Bạn cùng lớp|Hành khách|Bệnh nhân'],
    ['Meeting', 'Cuộc họp', '/ˈmiː.tɪŋ/', 'The ___ starts at nine.', 'A1', 'Bữa sáng|Kỳ thi|Chuyến bay'],
    ['Task', 'Nhiệm vụ', '/tɑːsk/', 'This ___ is important.', 'A2', 'Món ăn|Căn bệnh|Hóa đơn'],
    ['Manager', 'Quản lý', '/ˈmæn.ɪ.dʒər/', 'The ___ approved the plan.', 'A2', 'Phi công|Y tá|Hướng dẫn viên'],
    ['Salary', 'Lương', '/ˈsæl.ər.i/', 'Her ___ increased this year.', 'A2', 'Bài giảng|Hộ chiếu|Thành phần'],
    ['Promotion', 'Sự thăng chức', '/prəˈməʊ.ʃən/', 'He got a ___ after two years.', 'B1', 'Sự hoãn chuyến|Cơn đau|Lời khuyên'],
    ['Client', 'Khách hàng', '/ˈklaɪ.ənt/', 'The ___ requested a report.', 'B1', 'Giáo viên|Hành lý|Đầu bếp'],
    ['Presentation', 'Bài thuyết trình', '/ˌprez.ənˈteɪ.ʃən/', 'Her ___ was clear and confident.', 'B1', 'Đơn thuốc|Món khai vị|Bài hát'],
    ['Efficient', 'Hiệu quả', '/ɪˈfɪʃ.ənt/', 'This system is fast and ___.', 'B2', 'Ngon miệng|Đau đớn|Lạc đường'],
  ]),
  ...topicWords('travel', [
    ['Destination', 'Điểm đến', '/ˌdes.tɪˈneɪ.ʃən/', 'Paris is our next ___.', 'A2', 'Hóa đơn|Triệu chứng|Từ điển'],
    ['Luggage', 'Hành lý', '/ˈlʌɡ.ɪdʒ/', 'My ___ is very heavy.', 'A2', 'Bài tập|Đơn thuốc|Mức lương'],
    ['Reservation', 'Sự đặt chỗ', '/ˌrez.əˈveɪ.ʃən/', 'I made a hotel ___.', 'B1', 'Sự thăng chức|Cơn đau|Món ăn'],
    ['Boarding Pass', 'Thẻ lên máy bay', '/ˈbɔːr.dɪŋ pæs/', 'Show your ___ at the gate.', 'A2', 'Sách giáo khoa|Hóa đơn điện|Thực đơn'],
    ['Itinerary', 'Lịch trình chuyến đi', '/aɪˈtɪn.ər.ər.i/', 'Our ___ includes three cities.', 'B1', 'Công thức nấu ăn|Bài kiểm tra|Hợp đồng'],
    ['Departure', 'Sự khởi hành', '/dɪˈpɑːr.tʃər/', 'The ___ time is 7 a.m.', 'B1', 'Bữa trưa|Cuộc họp|Đơn hàng'],
    ['Accommodation', 'Chỗ ở', '/əˌkɒm.əˈdeɪ.ʃən/', 'We found cheap ___.', 'B1', 'Bài giảng|Thiết bị|Triệu chứng'],
    ['Tourist', 'Khách du lịch', '/ˈtʊə.rɪst/', 'The ___ asked for directions.', 'A1', 'Bệnh nhân|Quản lý|Đồng nghiệp'],
    ['Journey', 'Hành trình', '/ˈdʒɜː.ni/', 'The train ___ was relaxing.', 'A2', 'Bài tập|Bữa ăn|Tin nhắn'],
    ['Explore', 'Khám phá', '/ɪkˈsplɔːr/', 'We want to ___ the old town.', 'A2', 'In ấn|Nghỉ ốm|Thanh toán'],
  ]),
  ...topicWords('food', [
    ['Ingredient', 'Nguyên liệu', '/ɪnˈɡriː.di.ənt/', 'Tomato is the main ___.', 'A2', 'Hành lý|Màn hình|Học bổng'],
    ['Delicious', 'Ngon', '/dɪˈlɪʃ.əs/', 'This soup is ___.', 'A1', 'Đau|Đắt|Muộn'],
    ['Appetizer', 'Món khai vị', '/ˈæp.ə.taɪ.zər/', 'We ordered an ___ first.', 'B1', 'Môn học|Hợp đồng|Cổng sân bay'],
    ['Beverage', 'Đồ uống', '/ˈbev.ər.ɪdʒ/', 'Tea is a popular ___.', 'B1', 'Thiết bị|Nơi ở|Nhiệm vụ'],
    ['Recipe', 'Công thức nấu ăn', '/ˈres.ɪ.pi/', 'I followed the ___ carefully.', 'A2', 'Lịch trình|Bài giảng|Đơn thuốc'],
    ['Flavor', 'Hương vị', '/ˈfleɪ.vər/', 'The ___ is sweet and fresh.', 'A2', 'Mức lương|Địa chỉ|Triệu chứng'],
    ['Spicy', 'Cay', '/ˈspaɪ.si/', 'This curry is too ___.', 'A1', 'Lạnh|Im lặng|Chính xác'],
    ['Dessert', 'Món tráng miệng', '/dɪˈzɜːrt/', 'Ice cream is my favorite ___.', 'A1', 'Văn phòng|Bài tập|Hóa đơn'],
    ['Menu', 'Thực đơn', '/ˈmen.juː/', 'Can I see the ___, please?', 'A1', 'Hộ chiếu|Bảng điểm|Kết quả'],
    ['Nutritious', 'Bổ dưỡng', '/njuːˈtrɪʃ.əs/', 'Vegetables are very ___.', 'B1', 'Ồn ào|Rỗng|Xa xôi'],
  ]),
  ...topicWords('tech', [
    ['Device', 'Thiết bị', '/dɪˈvaɪs/', 'A phone is a useful ___.', 'A2', 'Món ăn|Học bổng|Triệu chứng'],
    ['Software', 'Phần mềm', '/ˈsɒft.weər/', 'This ___ helps us edit photos.', 'A2', 'Hành lý|Công thức|Đơn thuốc'],
    ['Update', 'Cập nhật', '/ˌʌpˈdeɪt/', 'Please ___ the app regularly.', 'A2', 'Nấu|Khám|Đặt bàn'],
    ['Password', 'Mật khẩu', '/ˈpɑːs.wɜːd/', 'Never share your ___.', 'A2', 'Hóa đơn|Món tráng miệng|Điểm đến'],
    ['Download', 'Tải xuống', '/ˌdaʊnˈləʊd/', 'You can ___ the file now.', 'A1', 'Tham dự|Hủy|Bổ nhiệm'],
    ['Connection', 'Kết nối', '/kəˈnek.ʃən/', 'The internet ___ is slow.', 'B1', 'Mùi vị|Cơn đau|Đường bay'],
    ['Privacy', 'Quyền riêng tư', '/ˈprɪv.ə.si/', 'Online ___ is important.', 'B1', 'Khai vị|Đúng giờ|Học phí'],
    ['Search Engine', 'Công cụ tìm kiếm', '/sɜːrtʃ ˈen.dʒɪn/', 'Google is a ___ .', 'A2', 'Sổ tay|Bệnh viện|Quầy lễ tân'],
    ['Artificial Intelligence', 'Trí tuệ nhân tạo', '/ˌɑː.tɪˈfɪʃ.əl ɪnˈtel.ɪ.dʒəns/', '___ can support learning.', 'B2', 'Đồ uống nóng|Hành lý ký gửi|Việc nhà'],
    ['Cybersecurity', 'An ninh mạng', '/ˌsaɪ.bə.sɪˈkjʊə.rə.ti/', 'Companies invest in ___.', 'B2', 'Ẩm thực|Thể dục|Du lịch'],
  ]),
  ...topicWords('health', [
    ['Symptom', 'Triệu chứng', '/ˈsɪmp.təm/', 'Fever is a common ___.', 'A2', 'Hộ chiếu|Món ăn|Bài tập'],
    ['Appointment', 'Cuộc hẹn', '/əˈpɔɪnt.mənt/', 'I have a doctor ___ tomorrow.', 'A2', 'Hợp đồng|Lịch bay|Công thức'],
    ['Medicine', 'Thuốc', '/ˈmed.ɪ.sən/', 'Take this ___ twice a day.', 'A1', 'Vé tàu|Mức lương|Mật khẩu'],
    ['Exercise', 'Tập thể dục', '/ˈek.sə.saɪz/', 'Regular ___ keeps you healthy.', 'A1', 'Bài giảng|Hành lý|Bữa ăn'],
    ['Nutrition', 'Dinh dưỡng', '/njuːˈtrɪʃ.ən/', 'Good ___ supports growth.', 'B1', 'Du lịch|Tiếp thị|Nâng cấp'],
    ['Recover', 'Phục hồi', '/rɪˈkʌv.ər/', 'She will ___ after rest.', 'B1', 'Tải xuống|Đặt phòng|Thuyết trình'],
    ['Allergy', 'Dị ứng', '/ˈæl.ə.dʒi/', 'He has a peanut ___.', 'B1', 'Học bổng|Hợp đồng|Thiết bị'],
    ['Treatment', 'Sự điều trị', '/ˈtriːt.mənt/', 'The ___ lasted two weeks.', 'B1', 'Món tráng miệng|Điểm đến|Bài tập'],
    ['Healthy', 'Khỏe mạnh', '/ˈhel.θi/', 'A ___ diet is important.', 'A1', 'Cay|Muộn|Ẩn danh'],
    ['Prevent', 'Ngăn ngừa', '/prɪˈvent/', 'Vaccines help ___ disease.', 'B1', 'Đặt chỗ|Tìm kiếm|Tốt nghiệp'],
  ]),
  ...topicWords('business', [
    ['Revenue', 'Doanh thu', '/ˈrev.ən.juː/', 'The company increased its ___.', 'B2', 'Triệu chứng|Món khai vị|Hành lý'],
    ['Contract', 'Hợp đồng', '/ˈkɒn.trækt/', 'Please read the ___ carefully.', 'B1', 'Công thức|Học bổng|Thẻ lên máy bay'],
    ['Customer', 'Khách hàng', '/ˈkʌs.tə.mər/', 'A happy ___ may return.', 'A2', 'Bệnh nhân|Bạn cùng lớp|Phi công'],
    ['Marketing', 'Tiếp thị', '/ˈmɑː.kɪ.tɪŋ/', 'Good ___ attracts buyers.', 'B1', 'Dinh dưỡng|Hành trình|Việc nhà'],
    ['Negotiation', 'Sự đàm phán', '/nɪˌɡəʊ.ʃiˈeɪ.ʃən/', 'The ___ took two hours.', 'B2', 'Món tráng miệng|Cuộc hẹn|Từ điển'],
    ['Investment', 'Khoản đầu tư', '/ɪnˈvest.mənt/', 'This ___ may bring profit.', 'B2', 'Đồ uống|Bài kiểm tra|Căn hộ'],
    ['Profit', 'Lợi nhuận', '/ˈprɒf.ɪt/', 'The shop made a good ___.', 'B1', 'Mật khẩu|Cơn sốt|Bảng điểm'],
    ['Strategy', 'Chiến lược', '/ˈstræt.ə.dʒi/', 'We need a new sales ___.', 'B2', 'Hương vị|Triệu chứng|Hành lý'],
    ['Invoice', 'Hóa đơn', '/ˈɪn.vɔɪs/', 'The ___ shows the total price.', 'B1', 'Hộ chiếu|Bài giảng|Đơn thuốc'],
    ['Launch', 'Ra mắt sản phẩm', '/lɔːntʃ/', 'We will ___ the app next month.', 'B1', 'Nghỉ ngơi|Khám bệnh|Rửa bát'],
  ]),
];

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key, required this.onThemeChanged});

  final ValueChanged<bool> onThemeChanged;

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  static const progressKey = 'quiz_vocab_progress_v2';
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
    final selectedWords = [...words]..shuffle(random);
    final pool = [...vocabData]..shuffle(random);
    return selectedWords.take(10).toList().asMap().entries.map((entry) {
      final index = entry.key;
      final word = entry.value;
      final type = QuestionType.values[index % QuestionType.values.length];

      if (type == QuestionType.enToVi) {
        final wrong = word.wrongOptions.take(3).toList();
        final options = [word.meaning, ...wrong]..shuffle(random);
        return QuizQuestion(
          id: '${word.id}_$index',
          word: word,
          type: type,
          prompt: 'Nghĩa tiếng Việt của "${word.word}" là gì?',
          subPrompt: word.pronunciation,
          options: options,
          correctAnswer: word.meaning,
          explanation: '"${word.word}" có nghĩa là "${word.meaning}". Ví dụ: ${word.example.replaceAll('___', word.word)}',
        );
      }

      if (type == QuestionType.viToEn) {
        final wrong = pool.where((item) => item.id != word.id).map((e) => e.word).take(3).toList();
        final options = [word.word, ...wrong]..shuffle(random);
        return QuizQuestion(
          id: '${word.id}_$index',
          word: word,
          type: type,
          prompt: 'Từ tiếng Anh nào mang nghĩa "${word.meaning}"?',
          options: options,
          correctAnswer: word.word,
          explanation: '"${word.meaning}" trong tiếng Anh là "${word.word}" ${word.pronunciation}.',
        );
      }

      final wrong = pool.where((item) => item.id != word.id).map((e) => e.word).take(3).toList();
      final options = [word.word, ...wrong]..shuffle(random);
      return QuizQuestion(
        id: '${word.id}_$index',
        word: word,
        type: type,
        prompt: 'Chọn từ phù hợp để điền vào chỗ trống:',
        subPrompt: word.example.contains('___') ? word.example : word.example.replaceAll(RegExp(word.word, caseSensitive: false), '___'),
        options: options,
        correctAnswer: word.word,
        explanation: 'Câu hoàn chỉnh: ${word.example.replaceAll('___', word.word)}',
      );
    }).toList();
  }

  void _startTopicQuiz(Topic topic) {
    final words = vocabData.where((word) => word.topicId == topic.id).toList();
    setState(() {
      activeTopicTitle = '${topic.title} - ${topic.titleVi}';
      activeQuestions = _generateQuestions(words);
      lastResult = null;
      selectedIndex = 1;
    });
  }

  void _startWrongWordsQuiz() {
    final wrongIds = progress.wrongWords.map((e) => e.wordId).toSet();
    final words = vocabData.where((word) => wrongIds.contains(word.id)).toList();
    if (words.isEmpty) return;
    setState(() {
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
    progress.lastActiveDate = todayString();

    final stat = progress.topicStats.putIfAbsent(topicId, () => TopicStat());
    stat.completedCount += 1;
    stat.highestScore = max(stat.highestScore, percent);

    for (final word in wrongWords) {
      final existing = progress.wrongWords.where((record) => record.wordId == word.id).firstOrNull;
      if (existing == null) {
        progress.wrongWords.add(WrongWordRecord(wordId: word.id, wrongCount: 1, lastWrongAt: DateTime.now().toIso8601String()));
      } else {
        existing.wrongCount += 1;
        existing.lastWrongAt = DateTime.now().toIso8601String();
      }
    }

    await _saveProgress();
    setState(() {
      lastResult = QuizResultData(
        correctCount: correctCount,
        totalQuestions: total,
        wrongWords: wrongWords,
        percent: percent,
      );
    });
  }

  Future<void> _removeWrongWord(String id) async {
    setState(() => progress.wrongWords.removeWhere((record) => record.wordId == id));
    await _saveProgress();
  }

  Future<void> _resetProgress() async {
    setState(() => progress = UserProgress());
    await _saveProgress();
  }

  Future<void> _speak(String word) async {
    if (!soundEnabled) return;
    await tts.stop();
    await tts.speak(word);
  }

  @override
  Widget build(BuildContext context) {
    if (prefs == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final screens = [
      HomeScreen(
        progress: progress,
        onStartLearning: () => setState(() => selectedIndex = 1),
        onViewProgress: () => setState(() => selectedIndex = 3),
      ),
      activeQuestions == null
          ? TopicsScreen(progress: progress, onStartTopic: _startTopicQuiz)
          : lastResult == null
              ? QuizScreen(
                  title: activeTopicTitle,
                  questions: activeQuestions!,
                  autoSpeak: autoSpeak,
                  soundEnabled: soundEnabled,
                  onSpeak: _speak,
                  onExit: () => setState(() {
                    activeQuestions = null;
                    lastResult = null;
                  }),
                  onFinish: (correct, wrong) => _finishQuiz(
                    activeQuestions!.isNotEmpty ? activeQuestions!.first.word.topicId : 'general',
                    correct,
                    wrong,
                  ),
                )
              : ResultScreen(
                  result: lastResult!,
                  onRetry: () {
                    final first = activeQuestions?.first.word.topicId;
                    final topic = topics.where((t) => t.id == first).firstOrNull;
                    if (topic != null) _startTopicQuiz(topic);
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
      WrongWordsScreen(
        records: progress.wrongWords,
        onRemove: _removeWrongWord,
        onStartQuiz: _startWrongWordsQuiz,
      ),
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
        centerTitle: false,
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
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 250),
        child: screens[selectedIndex],
      ),
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
        destinations: [
          const NavigationDestination(icon: Icon(Icons.home_rounded), label: 'Trang chủ'),
          const NavigationDestination(icon: Icon(Icons.quiz_rounded), label: 'Quiz'),
          NavigationDestination(icon: Badge(label: Text('${progress.wrongWords.length}'), child: const Icon(Icons.replay_rounded)), label: 'Từ sai'),
          const NavigationDestination(icon: Icon(Icons.bar_chart_rounded), label: 'Tiến độ'),
          const NavigationDestination(icon: Icon(Icons.settings_rounded), label: 'Cài đặt'),
        ],
      ),
    );
  }
}

class QuizResultData {
  const QuizResultData({
    required this.correctCount,
    required this.totalQuestions,
    required this.wrongWords,
    required this.percent,
  });

  final int correctCount;
  final int totalQuestions;
  final List<VocabWord> wrongWords;
  final int percent;
}

extension IterableFirstOrNull<E> on Iterable<E> {
  E? get firstOrNull => isEmpty ? null : first;
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
              Text('Làm quiz, ghi nhớ từ sai và theo dõi tiến độ mỗi ngày.', style: TextStyle(color: Colors.white70, fontSize: 15)),
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
        const SizedBox(height: 20),
        FilledButton.icon(
          onPressed: onStartLearning,
          icon: const Icon(Icons.play_arrow_rounded),
          label: const Text('Bắt đầu học'),
        ),
        const SizedBox(height: 12),
        OutlinedButton.icon(
          onPressed: onViewProgress,
          icon: const Icon(Icons.bar_chart_rounded),
          label: const Text('Xem tiến độ'),
        ),
      ],
    );
  }
}

class TopicsScreen extends StatelessWidget {
  const TopicsScreen({super.key, required this.progress, required this.onStartTopic});

  final UserProgress progress;
  final ValueChanged<Topic> onStartTopic;

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: topics.length,
      itemBuilder: (context, index) {
        final topic = topics[index];
        final stat = progress.topicStats[topic.id];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            contentPadding: const EdgeInsets.all(18),
            leading: CircleAvatar(child: Icon(topic.icon)),
            title: Text('${topic.title} • ${topic.titleVi}', style: const TextStyle(fontWeight: FontWeight.w800)),
            subtitle: Padding(
              padding: const EdgeInsets.only(top: 6),
              child: Text('${topic.description}\n10 câu • ${topic.level}${stat == null ? '' : ' • Điểm cao: ${stat.highestScore}%'}'),
            ),
            isThreeLine: true,
            trailing: const Icon(Icons.chevron_right_rounded),
            onTap: () => onStartTopic(topic),
          ),
        );
      },
    );
  }
}

class QuizScreen extends StatefulWidget {
  const QuizScreen({
    super.key,
    required this.title,
    required this.questions,
    required this.autoSpeak,
    required this.soundEnabled,
    required this.onSpeak,
    required this.onExit,
    required this.onFinish,
  });

  final String title;
  final List<QuizQuestion> questions;
  final bool autoSpeak;
  final bool soundEnabled;
  final ValueChanged<String> onSpeak;
  final VoidCallback onExit;
  final void Function(int correctCount, List<VocabWord> wrongWords) onFinish;

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  int index = 0;
  int correctCount = 0;
  String? selected;
  bool answered = false;
  final wrongWords = <VocabWord>[];

  QuizQuestion get question => widget.questions[index];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _autoSpeak());
  }

  void _autoSpeak() {
    if (widget.autoSpeak && widget.soundEnabled) {
      widget.onSpeak(question.word.word);
    }
  }

  void _choose(String option) {
    if (answered) return;
    final isCorrect = option == question.correctAnswer;
    HapticFeedback.selectionClick();
    setState(() {
      selected = option;
      answered = true;
      if (isCorrect) {
        correctCount += 1;
      } else {
        wrongWords.add(question.word);
      }
    });
  }

  void _next() {
    if (index + 1 >= widget.questions.length) {
      widget.onFinish(correctCount, wrongWords);
      return;
    }
    setState(() {
      index += 1;
      selected = null;
      answered = false;
    });
    _autoSpeak();
  }

  @override
  Widget build(BuildContext context) {
    final progress = (index + 1) / widget.questions.length;
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Row(
          children: [
            IconButton(onPressed: widget.onExit, icon: const Icon(Icons.arrow_back_rounded)),
            Expanded(child: Text(widget.title, textAlign: TextAlign.center, style: const TextStyle(fontWeight: FontWeight.w800))),
            Chip(label: Text('$correctCount đúng')),
          ],
        ),
        const SizedBox(height: 8),
        LinearProgressIndicator(value: progress, minHeight: 10, borderRadius: BorderRadius.circular(99)),
        const SizedBox(height: 18),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(22),
            child: Column(
              children: [
                Text('Câu ${index + 1}/${widget.questions.length}', style: TextStyle(color: Theme.of(context).colorScheme.primary, fontWeight: FontWeight.w800)),
                const SizedBox(height: 12),
                Text(question.prompt, textAlign: TextAlign.center, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900)),
                if (question.subPrompt != null) ...[
                  const SizedBox(height: 12),
                  Text(question.subPrompt!, textAlign: TextAlign.center, style: const TextStyle(fontSize: 16)),
                ],
                const SizedBox(height: 12),
                TextButton.icon(onPressed: () => widget.onSpeak(question.word.word), icon: const Icon(Icons.volume_up_rounded), label: const Text('Nghe phát âm')),
              ],
            ),
          ),
        ),
        const SizedBox(height: 8),
        for (final option in question.options)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 6),
            child: AnswerButton(
              option: option,
              selected: selected == option,
              isCorrect: option == question.correctAnswer,
              answered: answered,
              onTap: () => _choose(option),
            ),
          ),
        if (answered) ...[
          const SizedBox(height: 12),
          Card(
            color: Theme.of(context).colorScheme.primaryContainer,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Text(question.explanation ?? '', style: TextStyle(color: Theme.of(context).colorScheme.onPrimaryContainer)),
            ),
          ),
          const SizedBox(height: 12),
          FilledButton.icon(
            onPressed: _next,
            icon: Icon(index + 1 == widget.questions.length ? Icons.flag_rounded : Icons.arrow_forward_rounded),
            label: Text(index + 1 == widget.questions.length ? 'Xem kết quả' : 'Câu tiếp theo'),
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
    required this.selected,
    required this.isCorrect,
    required this.answered,
    required this.onTap,
  });

  final String option;
  final bool selected;
  final bool isCorrect;
  final bool answered;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    Color? color;
    IconData? icon;
    if (answered && isCorrect) {
      color = Colors.green.withOpacity(0.16);
      icon = Icons.check_circle_rounded;
    } else if (answered && selected && !isCorrect) {
      color = Colors.red.withOpacity(0.16);
      icon = Icons.cancel_rounded;
    }

    return InkWell(
      borderRadius: BorderRadius.circular(18),
      onTap: answered ? null : onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color ?? Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: selected ? Theme.of(context).colorScheme.primary : Theme.of(context).dividerColor),
        ),
        child: Row(
          children: [
            Expanded(child: Text(option, style: const TextStyle(fontWeight: FontWeight.w800))),
            if (icon != null) Icon(icon, color: isCorrect ? Colors.green : Colors.red),
          ],
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

  String get rating => result.percent >= 90 ? 'Xuất sắc' : result.percent >= 70 ? 'Tốt' : 'Cần luyện thêm';

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(24),
      children: [
        const Icon(Icons.emoji_events_rounded, size: 84, color: Colors.amber),
        const SizedBox(height: 14),
        Text(rating, textAlign: TextAlign.center, style: const TextStyle(fontSize: 30, fontWeight: FontWeight.w900)),
        const SizedBox(height: 8),
        Text('${result.correctCount}/${result.totalQuestions} câu đúng • ${result.percent}%', textAlign: TextAlign.center, style: const TextStyle(fontSize: 18)),
        const SizedBox(height: 24),
        FilledButton.icon(onPressed: onRetry, icon: const Icon(Icons.refresh_rounded), label: const Text('Làm lại')),
        const SizedBox(height: 12),
        OutlinedButton.icon(onPressed: onOtherTopic, icon: const Icon(Icons.grid_view_rounded), label: const Text('Chọn chủ đề khác')),
        const SizedBox(height: 12),
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
    final words = records
        .map((record) => MapEntry(record, vocabData.where((word) => word.id == record.wordId).firstOrNull))
        .where((entry) => entry.value != null)
        .toList();

    if (words.isEmpty) {
      return const EmptyState(icon: Icons.replay_rounded, title: 'Chưa có từ sai', subtitle: 'Làm quiz để hệ thống ghi nhớ các từ cần ôn lại.');
    }

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        FilledButton.icon(onPressed: onStartQuiz, icon: const Icon(Icons.play_arrow_rounded), label: const Text('Ôn tập từ sai')),
        const SizedBox(height: 12),
        for (final entry in words)
          Card(
            margin: const EdgeInsets.only(bottom: 10),
            child: ListTile(
              title: Text(entry.value!.word, style: const TextStyle(fontWeight: FontWeight.w900)),
              subtitle: Text('${entry.value!.meaning}\nSai ${entry.key.wrongCount} lần'),
              isThreeLine: true,
              trailing: IconButton(onPressed: () => onRemove(entry.key.wordId), icon: const Icon(Icons.close_rounded)),
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
    return ListView(
      padding: const EdgeInsets.all(16),
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
            Expanded(child: StatCard(title: 'Câu đúng', value: '${progress.totalCorrect}', icon: Icons.check_rounded)),
            const SizedBox(width: 12),
            Expanded(child: StatCard(title: 'Streak', value: '${progress.streakDays}', icon: Icons.local_fire_department_rounded)),
          ],
        ),
        const SizedBox(height: 20),
        Text('Tiến độ theo chủ đề', style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900)),
        const SizedBox(height: 10),
        for (final topic in topics)
          Card(
            margin: const EdgeInsets.only(bottom: 10),
            child: ListTile(
              leading: Icon(topic.icon),
              title: Text(topic.titleVi, style: const TextStyle(fontWeight: FontWeight.w800)),
              subtitle: Text('Đã làm: ${progress.topicStats[topic.id]?.completedCount ?? 0} lần'),
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
  final Future<void> Function() onResetProgress;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        SwitchListTile(
          value: soundEnabled,
          onChanged: onSoundChanged,
          title: const Text('Bật âm thanh'),
          secondary: const Icon(Icons.volume_up_rounded),
        ),
        SwitchListTile(
          value: autoSpeak,
          onChanged: onAutoSpeakChanged,
          title: const Text('Tự đọc từ khi vào câu hỏi'),
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
          subtitle: const Text('App lưu dữ liệu học tập offline trên thiết bị và không thu thập dữ liệu cá nhân.'),
          onTap: () => showDialog(context: context, builder: (_) => const PrivacyPolicyDialog()),
        ),
        ListTile(
          leading: const Icon(Icons.info_rounded),
          title: const Text('Phiên bản'),
          subtitle: const Text('1.0.0+1'),
        ),
        const SizedBox(height: 12),
        OutlinedButton.icon(
          onPressed: () async {
            final confirmed = await showDialog<bool>(
              context: context,
              builder: (_) => AlertDialog(
                title: const Text('Reset tiến độ?'),
                content: const Text('Thao tác này sẽ xóa điểm số, streak và danh sách từ sai trên thiết bị.'),
                actions: [
                  TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Hủy')),
                  FilledButton(onPressed: () => Navigator.pop(context, true), child: const Text('Reset')),
                ],
              ),
            );
            if (confirmed == true) await onResetProgress();
          },
          icon: const Icon(Icons.delete_outline_rounded),
          label: const Text('Reset tiến độ'),
        ),
      ],
    );
  }
}

class PrivacyPolicyDialog extends StatelessWidget {
  const PrivacyPolicyDialog({super.key});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Chính sách quyền riêng tư'),
      content: const SingleChildScrollView(
        child: Text(
          'Quiz Vocab hoạt động offline và không yêu cầu đăng nhập. Ứng dụng không thu thập tên, email, vị trí, danh bạ, ảnh hoặc dữ liệu cá nhân khác.\n\n'
          'Các dữ liệu như điểm số, streak, chủ đề đã học và danh sách từ sai chỉ được lưu cục bộ trên thiết bị bằng SharedPreferences. Người dùng có thể xóa dữ liệu này bằng chức năng Reset tiến độ hoặc bằng cách gỡ ứng dụng.\n\n'
          'Ứng dụng không hiển thị quảng cáo, không bán dữ liệu và không chia sẻ dữ liệu với bên thứ ba.',
        ),
      ),
      actions: [
        FilledButton(onPressed: () => Navigator.pop(context), child: const Text('Đã hiểu')),
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
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(icon, size: 32, color: Theme.of(context).colorScheme.primary),
            const SizedBox(height: 10),
            Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900)),
            Text(title, textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }
}

class EmptyState extends StatelessWidget {
  const EmptyState({super.key, required this.icon, required this.title, required this.subtitle});

  final IconData icon;
  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 72, color: Theme.of(context).colorScheme.primary),
            const SizedBox(height: 16),
            Text(title, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900)),
            const SizedBox(height: 8),
            Text(subtitle, textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }
}
