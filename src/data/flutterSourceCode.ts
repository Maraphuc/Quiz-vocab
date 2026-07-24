export interface FlutterFile {
  path: string;
  category: 'pubspec' | 'main' | 'models' | 'data' | 'services' | 'theme' | 'screens' | 'widgets' | 'android' | 'guide';
  description: string;
  code: string;
}

export const FLUTTER_PROJECT_FILES: FlutterFile[] = [
  {
    path: 'pubspec.yaml',
    category: 'pubspec',
    description: 'Cấu hình dependencies cho dự án Flutter',
    code: `name: quizvocab
description: "Ứng dụng học từ vựng tiếng Anh qua câu hỏi trắc nghiệm."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter
  cupertino_icons: ^1.0.8
  shared_preferences: ^2.3.2
  flutter_tts: ^4.2.0
  audioplayers: ^6.1.0
  google_fonts: ^6.2.1
  percent_indicator: ^4.2.3
  confetti: ^0.7.0
  animated_text_kit: ^4.2.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^5.0.0
  flutter_launcher_icons: ^0.14.1

flutter_launcher_icons:
  android: "launcher_icon"
  ios: true
  image_path: "assets/icon/app_icon.png"
  min_sdk_android: 21

flutter:
  uses-material-design: true
  assets:
    - assets/icon/
    - assets/sounds/
`
  },
  {
    path: 'lib/main.dart',
    category: 'main',
    description: 'Điểm khởi chạy ứng dụng Flutter, khởi tạo Theme và Storage',
    code: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'screens/main_navigation_screen.dart';
import 'services/storage_service.dart';
import 'theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  await StorageService.init();

  runApp(const QuizVocabApp());
}

class QuizVocabApp extends StatefulWidget {
  const QuizVocabApp({super.key});

  @override
  State<QuizVocabApp> createState() => _QuizVocabAppState();
}

class _QuizVocabAppState extends State<QuizVocabApp> {
  ValueNotifier<ThemeMode> themeModeNotifier = ValueNotifier(ThemeMode.light);

  @override
  void initState() {
    super.initState();
    bool isDark = StorageService.getDarkMode();
    themeModeNotifier.value = isDark ? ThemeMode.dark : ThemeMode.light;
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<ThemeMode>(
      valueListenable: themeModeNotifier,
      builder: (context, mode, child) {
        return MaterialApp(
          title: 'Quiz Vocab',
          debugShowCheckedModeBanner: false,
          themeMode: mode,
          theme: AppTheme.lightTheme,
          darkTheme: AppTheme.darkTheme,
          home: MainNavigationScreen(
            onToggleTheme: (isDark) {
              themeModeNotifier.value = isDark ? ThemeMode.dark : ThemeMode.light;
              StorageService.setDarkMode(isDark);
            },
          ),
        );
      },
    );
  }
}
`
  },
  {
    path: 'lib/models/vocab_word.dart',
    category: 'models',
    description: 'Data model đại diện cho một từ vựng tiếng Anh',
    code: `class VocabWord {
  final String id;
  final String word;
  final String meaning;
  final String pronunciation;
  final String example;
  final String topicId;
  final String level;
  final List<String> wrongOptions;

  VocabWord({
    required this.id,
    required this.word,
    required this.meaning,
    required this.pronunciation,
    required this.example,
    required this.topicId,
    required this.level,
    required this.wrongOptions,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'word': word,
        'meaning': meaning,
        'pronunciation': pronunciation,
        'example': example,
        'topicId': topicId,
        'level': level,
        'wrongOptions': wrongOptions,
      };

  factory VocabWord.fromJson(Map<String, dynamic> json) => VocabWord(
        id: json['id'],
        word: json['word'],
        meaning: json['meaning'],
        pronunciation: json['pronunciation'],
        example: json['example'],
        topicId: json['topicId'],
        level: json['level'],
        wrongOptions: List<String>.from(json['wrongOptions']),
      );
}
`
  },
  {
    path: 'lib/models/topic.dart',
    category: 'models',
    description: 'Data model đại diện cho một chủ đề bài học',
    code: `import 'package:flutter/material.dart';

class Topic {
  final String id;
  final String title;
  final String titleVi;
  final IconData icon;
  final int questionCount;
  final String level;
  final String description;
  final Color primaryColor;

  Topic({
    required this.id,
    required this.title,
    required this.titleVi,
    required this.icon,
    required this.questionCount,
    required this.level,
    required this.description,
    required this.primaryColor,
  });
}
`
  },
  {
    path: 'lib/data/sample_vocabulary.dart',
    category: 'data',
    description: 'Bộ dữ liệu 80+ từ vựng mẫu tiếng Anh chia đều 8 chủ đề',
    code: `import 'package:flutter/material.dart';
import '../models/topic.dart';
import '../models/vocab_word.dart';

final List<Topic> sampleTopics = [
  Topic(
    id: 'everyday',
    title: 'Everyday Life',
    titleVi: 'Cuộc sống hàng ngày',
    icon: Icons.sunny,
    questionCount: 10,
    level: 'A1 - A2',
    description: 'Từ vựng quen thuộc về thói quen và nhà cửa.',
    primaryColor: Colors.orange,
  ),
  Topic(
    id: 'school',
    title: 'School',
    titleVi: 'Trường học & Giáo dục',
    icon: Icons.school,
    questionCount: 10,
    level: 'A1 - B1',
    description: 'Từ vựng môn học và dụng cụ học tập.',
    primaryColor: Colors.blue,
  ),
  Topic(
    id: 'work',
    title: 'Work',
    titleVi: 'Công việc & Văn phòng',
    icon: Icons.work,
    questionCount: 10,
    level: 'A2 - B2',
    description: 'Từ vựng môi trường công sở và giao tiếp.',
    primaryColor: Colors.indigo,
  ),
  Topic(
    id: 'travel',
    title: 'Travel',
    titleVi: 'Du lịch & Di chuyển',
    icon: Icons.flight_takeoff,
    questionCount: 10,
    level: 'A2 - B1',
    description: 'Từ vựng sân bay, khách sạn và di chuyển.',
    primaryColor: Colors.teal,
  ),
  Topic(
    id: 'food',
    title: 'Food',
    titleVi: 'Ẩm thực & Nhà hàng',
    icon: Icons.restaurant,
    questionCount: 10,
    level: 'A1 - A2',
    description: 'Từ vựng món ăn, đồ uống và nhà hàng.',
    primaryColor: Colors.deepOrange,
  ),
  Topic(
    id: 'tech',
    title: 'Technology',
    titleVi: 'Công nghệ & Internet',
    icon: Icons.computer,
    questionCount: 10,
    level: 'A2 - B2',
    description: 'Từ vựng phần mềm, mạng và thiết bị số.',
    primaryColor: Colors.cyan,
  ),
  Topic(
    id: 'health',
    title: 'Health',
    titleVi: 'Sức khỏe & Y tế',
    icon: Icons.favorite,
    questionCount: 10,
    level: 'A2 - B2',
    description: 'Từ vựng triệu chứng, dinh dưỡng và tập luyện.',
    primaryColor: Colors.green,
  ),
  Topic(
    id: 'business',
    title: 'Business English',
    titleVi: 'Tiếng Anh Thương mại',
    icon: Icons.trending_up,
    questionCount: 10,
    level: 'B1 - B2',
    description: 'Từ vựng tài chính, hợp đồng và thương lượng.',
    primaryColor: Colors.purple,
  ),
];

final List<VocabWord> sampleVocabList = [
  // Everyday Life (10 words)
  VocabWord(
    id: 'ev_1',
    word: 'Routine',
    meaning: 'Thói quen hằng ngày',
    pronunciation: '/ruːˈtiːn/',
    example: 'My daily ___ includes morning exercise and reading.',
    topicId: 'everyday',
    level: 'A2',
    wrongOptions: ['Chuyến đi du lịch', 'Kế hoạch tài chính', 'Món ăn yêu thích'],
  ),
  VocabWord(
    id: 'ev_2',
    word: 'Neighbourhood',
    meaning: 'Khu xóm, hàng xóm',
    pronunciation: '/ˈneɪ.bə.hʊd/',
    example: 'Our ___ is quiet and very safe for children.',
    topicId: 'everyday',
    level: 'A2',
    wrongOptions: ['Tòa nhà văn phòng', 'Khu trung tâm thương mại', 'Sân bay quốc tế'],
  ),
  VocabWord(
    id: 'ev_3',
    word: 'Appliance',
    meaning: 'Thiết bị gia dụng',
    pronunciation: '/əˈplaɪ.əns/',
    example: 'The refrigerator is a vital kitchen ___.',
    topicId: 'everyday',
    level: 'B1',
    wrongOptions: ['Dụng cụ thể thao', 'Phần mềm máy tính', 'Quần áo thời trang'],
  ),
  VocabWord(
    id: 'ev_4',
    word: 'Leisure',
    meaning: 'Thời gian rảnh rỗi',
    pronunciation: '/ˈleʒ.ər/',
    example: 'Reading novels is my favorite ___ activity.',
    topicId: 'everyday',
    level: 'B1',
    wrongOptions: ['Áp lực công việc', 'Giờ học căng thẳng', 'Chi phí sinh hoạt'],
  ),
  VocabWord(
    id: 'ev_5',
    word: 'Chore',
    meaning: 'Việc nhà lặt vặt',
    pronunciation: '/tʃɔːr/',
    example: 'Washing dishes is a daily household ___.',
    topicId: 'everyday',
    level: 'A2',
    wrongOptions: ['Chuyến công tác', 'Trò chơi giải trí', 'Buổi trình diễn'],
  ),
  VocabWord(
    id: 'ev_6',
    word: 'Convenient',
    meaning: 'Tiện lợi, thuận tiện',
    pronunciation: '/kənˈviː.ni.ənt/',
    example: 'Living near the subway is extremely ___.',
    topicId: 'everyday',
    level: 'A2',
    wrongOptions: ['Phức tạp, rắc rối', 'Tốn kém, đắt đỏ', 'Xa xôi, hẻo lánh'],
  ),
  VocabWord(
    id: 'ev_7',
    word: 'Grateful',
    meaning: 'Biết ơn, cảm kích',
    pronunciation: '/ˈɡreɪt.fəl/',
    example: 'I am ___ for your kind support today.',
    topicId: 'everyday',
    level: 'A2',
    wrongOptions: ['Tức giận, bất bình', 'Thất vọng, chán nản', 'Lo lắng, sợ hãi'],
  ),
  VocabWord(
    id: 'ev_8',
    word: 'Punctual',
    meaning: 'Đúng giờ',
    pronunciation: '/ˈpʌŋk.tʃu.əl/',
    example: 'She is always ___ for family dinners.',
    topicId: 'everyday',
    level: 'B1',
    wrongOptions: ['Trễ hẹn, muộn màng', 'Lười biếng, uể uải', 'Hấp vội, vội vã'],
  ),
  VocabWord(
    id: 'ev_9',
    word: 'Commute',
    meaning: 'Đi lại hàng ngày (đi làm/đi học)',
    pronunciation: '/kəˈmjuːt/',
    example: 'My morning ___ takes about thirty minutes by bus.',
    topicId: 'everyday',
    level: 'B1',
    wrongOptions: ['Cuộc trò chuyện ngắn', 'Nghỉ ngơi cuối tuần', 'Mua sắm tạp hóa'],
  ),
  VocabWord(
    id: 'ev_10',
    word: 'Comfortable',
    meaning: 'Thoải mái, dễ chịu',
    pronunciation: '/ˈkʌm.fə.tə.bəl/',
    example: 'This new sofa is very ___ to sit on.',
    topicId: 'everyday',
    level: 'A1',
    wrongOptions: ['Cứng đờ, khó chịu', 'Bẩn thỉu, xập xệ', 'Chật chội, tù túng'],
  ),

  // School (10 words)
  VocabWord(
    id: 'sch_1',
    word: 'Assignment',
    meaning: 'Bài tập được giao',
    pronunciation: '/əˈsaɪn.mənt/',
    example: 'We must submit our history ___ by Friday.',
    topicId: 'school',
    level: 'A2',
    wrongOptions: ['Lịch nghỉ hè', 'Thẻ thư viện', 'Bộ đồng phục'],
  ),
  VocabWord(
    id: 'sch_2',
    word: 'Curriculum',
    meaning: 'Chương trình giảng dạy',
    pronunciation: '/kəˈrɪk.jə.ləm/',
    example: 'The school updated its science ___ this year.',
    topicId: 'school',
    level: 'B2',
    wrongOptions: ['Bảng điểm cá nhân', 'Phòng thí nghiệm', 'Xe đưa đón học sinh'],
  ),
  VocabWord(
    id: 'sch_3',
    word: 'Scholarship',
    meaning: 'Học bổng',
    pronunciation: '/ˈskɒl.ə.ʃɪp/',
    example: 'She won a full ___ to study at university.',
    topicId: 'school',
    level: 'B1',
    wrongOptions: ['Học phí hàng tháng', 'Giấy phép vắng học', 'Sổ liên lạc phụ huynh'],
  ),
  VocabWord(
    id: 'sch_4',
    word: 'Lecture',
    meaning: 'Bài giảng, buổi diễn thuyết',
    pronunciation: '/ˈlek.tʃər/',
    example: 'The professor gave an inspiring ___ today.',
    topicId: 'school',
    level: 'A2',
    wrongOptions: ['Kỳ thi tốt nghiệp', 'Trận đấu thể thao', 'Buổi sinh hoạt lớp'],
  ),
  VocabWord(
    id: 'sch_5',
    word: 'Graduate',
    meaning: 'Tốt nghiệp',
    pronunciation: '/ˈɡrædʒ.u.eɪt/',
    example: 'He will ___ from high school next month.',
    topicId: 'school',
    level: 'A2',
    wrongOptions: ['Nhập học, ghi danh', 'Bỏ học giữa chừng', 'Thi lại môn học'],
  ),
  VocabWord(
    id: 'sch_6',
    word: 'Laboratory',
    meaning: 'Phòng thí nghiệm',
    pronunciation: '/ləˈbɒr.ə.tər.i/',
    example: 'Students wear safety glasses in the chemistry ___.',
    topicId: 'school',
    level: 'B1',
    wrongOptions: ['Sân vận động', 'Căng tin trường học', 'Phòng ban giám hiệu'],
  ),
  VocabWord(
    id: 'sch_7',
    word: 'Academic',
    meaning: 'Thuộc về học thuật',
    pronunciation: '/ˌæk.əˈdem.ɪk/',
    example: 'The school has very high ___ standards.',
    topicId: 'school',
    level: 'B1',
    wrongOptions: ['Mang tính giải trí', 'Thuộc về kinh doanh', 'Mang tính thể thao'],
  ),
  VocabWord(
    id: 'sch_8',
    word: 'Dormitory',
    meaning: 'Ký túc xá',
    pronunciation: '/ˈdɔː.mɪ.tər.i/',
    example: 'Freshmen usually live in the university ___.',
    topicId: 'school',
    level: 'B1',
    wrongOptions: ['Nhà hội trường', 'Thư viện trung tâm', 'Bãi đỗ xe sinh viên'],
  ),
  VocabWord(
    id: 'sch_9',
    word: 'Syllabus',
    meaning: 'Đề cương môn học',
    pronunciation: '/ˈsɪl.ə.bəs/',
    example: 'Check the ___ to see grading policies.',
    topicId: 'school',
    level: 'B2',
    wrongOptions: ['Bằng cấp chính thức', 'Phiếu ăn căng tin', 'Nội quy nhà trường'],
  ),
  VocabWord(
    id: 'sch_10',
    word: 'Tutor',
    meaning: 'Gia sư, trợ giảng',
    pronunciation: '/ˈtʃuː.tər/',
    example: 'A private ___ helped him pass math.',
    topicId: 'school',
    level: 'A2',
    wrongOptions: ['Hiệu trưởng', 'Bảo vệ trường', 'Bạn cùng lớp'],
  ),

  // Work (10 words)
  VocabWord(
    id: 'wk_1',
    word: 'Deadline',
    meaning: 'Hạn chót',
    pronunciation: '/ˈded.laɪn/',
    example: 'We must finish the project before the ___.',
    topicId: 'work',
    level: 'A2',
    wrongOptions: ['Giờ nghỉ trưa', 'Lương thưởng', 'Hợp đồng thử việc'],
  ),
  VocabWord(
    id: 'wk_2',
    word: 'Promotion',
    meaning: 'Thăng chức, thăng tiến',
    pronunciation: '/prəˈməʊ.ʃən/',
    example: 'Her hard work earned her a big ___.',
    topicId: 'work',
    level: 'B1',
    wrongOptions: ['Việc sa thải', 'Sự xin nghỉ phép', 'Lỗi kỹ thuật'],
  ),
  VocabWord(
    id: 'wk_3',
    word: 'Colleague',
    meaning: 'Đồng nghiệp',
    pronunciation: '/ˈkɒl.iːɡ/',
    example: 'I have a meeting with my senior ___ at 2 PM.',
    topicId: 'work',
    level: 'A2',
    wrongOptions: ['Khách hàng cá nhân', 'Đối thủ cạnh tranh', 'Nhà cung cấp'],
  ),
  VocabWord(
    id: 'wk_4',
    word: 'Salary',
    meaning: 'Tiền lương',
    pronunciation: '/ˈsæl.ər.i/',
    example: 'The company offers a competitive monthly ___.',
    topicId: 'work',
    level: 'A1',
    wrongOptions: ['Bàn làm việc', 'Quy trình tuyển dụng', 'Bộ hồ sơ xin việc'],
  ),
  VocabWord(
    id: 'wk_5',
    word: 'Interview',
    meaning: 'Phỏng vấn',
    pronunciation: '/ˈɪn.tə.vjuː/',
    example: 'He wore a formal suit for his job ___.',
    topicId: 'work',
    level: 'A2',
    wrongOptions: ['Buổi tiệc chia tay', 'Lễ ký hợp đồng', 'Giờ tăng ca'],
  ),
  VocabWord(
    id: 'wk_6',
    word: 'Department',
    meaning: 'Phòng ban',
    pronunciation: '/dɪˈpɑːt.mənt/',
    example: 'She works in the marketing ___.',
    topicId: 'work',
    level: 'A2',
    wrongOptions: ['Chi nhánh nước ngoài', 'Bãi đỗ xe công ty', 'Trụ sở chính'],
  ),
  VocabWord(
    id: 'wk_7',
    word: 'Productivity',
    meaning: 'Năng suất làm việc',
    pronunciation: '/ˌprɒd.ʌkˈtɪv.ə.ti/',
    example: 'Short breaks can improve overall workplace ___.',
    topicId: 'work',
    level: 'B2',
    wrongOptions: ['Sự mệt mỏi', 'Tỷ lệ thất nghiệp', 'Khoản chi phí phát sinh'],
  ),
  VocabWord(
    id: 'wk_8',
    word: 'Resign',
    meaning: 'Từ chức, xin nghỉ việc',
    pronunciation: '/rɪˈzaɪn/',
    example: 'He decided to ___ to start his own business.',
    topicId: 'work',
    level: 'B1',
    wrongOptions: ['Ký hợp đồng mới', 'Nộp hồ sơ xin việc', 'Nhận thưởng quý'],
  ),
  VocabWord(
    id: 'wk_9',
    word: 'Supervisor',
    meaning: 'Người giám sát, quản lý',
    pronunciation: '/ˈsuː.pə.vaɪ.zər/',
    example: 'Report any problems directly to your ___.',
    topicId: 'work',
    level: 'B1',
    wrongOptions: ['Thực tập sinh', 'Bảo vệ tòa nhà', 'Lễ tân công ty'],
  ),
  VocabWord(
    id: 'wk_10',
    word: 'Task',
    meaning: 'Nhiệm vụ, công việc',
    pronunciation: '/tɑːsk/',
    example: 'Each team member was assigned a specific ___.',
    topicId: 'work',
    level: 'A1',
    wrongOptions: ['Phòng họp kín', 'Chương trình khuyến mãi', 'Cuộc gọi cá nhân'],
  ),

  // Travel (10 words)
  VocabWord(
    id: 'tr_1',
    word: 'Destination',
    meaning: 'Điểm đến',
    pronunciation: '/ˌdes.tɪˈneɪ.ʃən/',
    example: 'Paris is a popular tourist ___ in Western Europe.',
    topicId: 'travel',
    level: 'A2',
    wrongOptions: ['Điểm xuất phát', 'Vé máy bay khứ hồi', 'Hành lý ký gửi'],
  ),
  VocabWord(
    id: 'tr_2',
    word: 'Passport',
    meaning: 'Hộ chiếu',
    pronunciation: '/ˈpɑːs.pɔːt/',
    example: 'You must show your valid ___ at border control.',
    topicId: 'travel',
    level: 'A1',
    wrongOptions: ['Thẻ tín dụng', 'Thẻ căn cước công dân', 'Vé xe buýt'],
  ),
  VocabWord(
    id: 'tr_3',
    word: 'Itinerary',
    meaning: 'Lịch trình chuyến đi',
    pronunciation: '/aɪˈtɪn.ər.ər.i/',
    example: 'The travel agent gave us a detailed travel ___.',
    topicId: 'travel',
    level: 'B2',
    wrongOptions: ['Bản đồ du lịch', 'Hóa đơn khách sạn', 'Bảo hiểm du lịch'],
  ),
  VocabWord(
    id: 'tr_4',
    word: 'Luggage',
    meaning: 'Hành lý',
    pronunciation: '/ˈlʌɡ.ɪdʒ/',
    example: 'Please do not leave your ___ unattended at airport.',
    topicId: 'travel',
    level: 'A2',
    wrongOptions: ['Phương tiện đi lại', 'Món ăn đặc sản', 'Quà lưu niệm'],
  ),
  VocabWord(
    id: 'tr_5',
    word: 'Accommodation',
    meaning: 'Chỗ ở (khách sạn, nhà nghỉ)',
    pronunciation: '/əˌkɒm.əˈdeɪ.ʃən/',
    example: 'We booked our hotel ___ online in advance.',
    topicId: 'travel',
    level: 'B1',
    wrongOptions: ['Dịch vụ cho thuê xe', 'Tài xế bản địa', 'Địa điểm tham quan'],
  ),
  VocabWord(
    id: 'tr_6',
    word: 'Souvenir',
    meaning: 'Quà lưu niệm',
    pronunciation: '/ˌsuː.vənˈɪər/',
    example: 'I bought a hand-crafted keychain as a ___.',
    topicId: 'travel',
    level: 'A2',
    wrongOptions: ['Thực đơn nhà hàng', 'Bản đồ thành phố', 'Thẻ phòng khách sạn'],
  ),
  VocabWord(
    id: 'tr_7',
    word: 'Boarding',
    meaning: 'Sự lên tàu/máy bay',
    pronunciation: '/ˈbɔː.dɪŋ/',
    example: 'Passengers are requested to proceed to gate 5 for ___.',
    topicId: 'travel',
    level: 'B1',
    wrongOptions: ['Sự hạ cánh', 'Sự hoãn chuyến', 'Sự đổi tiền tệ'],
  ),
  VocabWord(
    id: 'tr_8',
    word: 'Customs',
    meaning: 'Hải quan',
    pronunciation: '/ˈkʌs.təmz/',
    example: 'All foreign travelers must clear ___ at the airport.',
    topicId: 'travel',
    level: 'B1',
    wrongOptions: ['Dịch vụ taxi', 'Bàn hướng dẫn du lịch', 'Phòng chờ thương gia'],
  ),
  VocabWord(
    id: 'tr_9',
    word: 'Sightseeing',
    meaning: 'Sự ngắm cảnh, tham quan',
    pronunciation: '/ˈsaɪtˌsiː.ɪŋ/',
    example: 'We went on a bus tour for day-long ___.',
    topicId: 'travel',
    level: 'A2',
    wrongOptions: ['Chuyến đi công tác', 'Mua sắm siêu thị', 'Đổ xăng xe'],
  ),
  VocabWord(
    id: 'tr_10',
    word: 'Delay',
    meaning: 'Sự trì hoãn, trễ chuyến',
    pronunciation: '/dɪˈleɪ/',
    example: 'Bad weather caused a two-hour flight ___.',
    topicId: 'travel',
    level: 'A2',
    wrongOptions: ['Khởi hành đúng giờ', 'Hạ cánh khẩn cấp', 'Đổi chỗ ngồi'],
  ),

  // Food (10 words)
  VocabWord(
    id: 'fd_1',
    word: 'Recipe',
    meaning: 'Công thức nấu ăn',
    pronunciation: '/ˈres.ɪ.pi/',
    example: 'Follow this simple ___ to make delicious soup.',
    topicId: 'food',
    level: 'A2',
    wrongOptions: ['Hóa đơn thanh toán', 'Thực đơn đồ uống', 'Thiết bị làm bếp'],
  ),
  VocabWord(
    id: 'fd_2',
    word: 'Ingredient',
    meaning: 'Nguyên liệu',
    pronunciation: '/ɪnˈɡriː.di.ənt/',
    example: 'Fresh tomatoes are a key ___ in pizza sauce.',
    topicId: 'food',
    level: 'B1',
    wrongOptions: ['Bữa ăn chính', 'Kỹ thuật đầu bếp', 'Dụng cụ ăn uống'],
  ),
  VocabWord(
    id: 'fd_3',
    word: 'Nutrition',
    meaning: 'Dinh dưỡng',
    pronunciation: '/njuːˈtrɪʃ.ən/',
    example: 'Eating vegetables provides essential ___.',
    topicId: 'food',
    level: 'B1',
    wrongOptions: ['Độ cay nồng', 'Mùi vị độc hại', 'Màu sắc nhân tạo'],
  ),
  VocabWord(
    id: 'fd_4',
    word: 'Delicious',
    meaning: 'Thơm ngon, ngon miệng',
    pronunciation: '/dɪˈlɪʃ.əs/',
    example: 'This traditional chocolate cake tastes ___.',
    topicId: 'food',
    level: 'A1',
    wrongOptions: ['Đắng chát, khó nuốt', 'Thiu thối, mốc meo', 'Mặn chát'],
  ),
  VocabWord(
    id: 'fd_5',
    word: 'Beverage',
    meaning: 'Đồ uống, thức uống',
    pronunciation: '/ˈbev.ər.ɪdʒ/',
    example: 'Fresh fruit juice is a refreshing summer ___.',
    topicId: 'food',
    level: 'B1',
    wrongOptions: ['Món ăn tráng miệng', 'Gia vị tẩm ướp', 'Thịt nướng'],
  ),
  VocabWord(
    id: 'fd_6',
    word: 'Appetizer',
    meaning: 'Món khai vị',
    pronunciation: '/ˈæp.ə.taɪ.zər/',
    example: 'We ordered spring rolls as our ___.',
    topicId: 'food',
    level: 'B1',
    wrongOptions: ['Món ăn chính', 'Món tráng miệng', 'Đồ uống có cồn'],
  ),
  VocabWord(
    id: 'fd_7',
    word: 'Cuisine',
    meaning: 'Nền ẩm thực',
    pronunciation: '/kwɪˈziːn/',
    example: 'Vietnamese ___ is famous for its fresh herbs.',
    topicId: 'food',
    level: 'B2',
    wrongOptions: ['Giá cả món ăn', 'Quy trình rửa bát', 'Khuôn viên nhà hàng'],
  ),
  VocabWord(
    id: 'fd_8',
    word: 'Vegetarian',
    meaning: 'Thuộc đồ ăn chay',
    pronunciation: '/ˌvedʒ.ɪˈteə.ri.ən/',
    example: 'This restaurant offers many ___ dishes.',
    topicId: 'food',
    level: 'A2',
    wrongOptions: ['Món ăn cay nồng', 'Người thích ăn thịt', 'Đồ ăn nhanh'],
  ),
  VocabWord(
    id: 'fd_9',
    word: 'Flavor',
    meaning: 'Hương vị',
    pronunciation: '/ˈfleɪ.vər/',
    example: 'Herbs add a rich ___ to the stew.',
    topicId: 'food',
    level: 'A2',
    wrongOptions: ['Khối lượng bữa ăn', 'Nhiệt độ phòng', 'Thời hạn sử dụng'],
  ),
  VocabWord(
    id: 'fd_10',
    word: 'Reservation',
    meaning: 'Sự đặt bàn / đặt chỗ trước',
    pronunciation: '/ˌrez.əˈveɪ.ʃən/',
    example: 'I made a dinner ___ for 7 PM.',
    topicId: 'food',
    level: 'A2',
    wrongOptions: ['Hóa đơn tính tiền', 'Lời phàn nàn', 'Dịch vụ giao hàng'],
  ),

  // Technology (10 words)
  VocabWord(
    id: 'tc_1',
    word: 'Application',
    meaning: 'Ứng dụng (phần mềm)',
    pronunciation: '/ˌæp.lɪˈkeɪ.ʃən/',
    example: 'You can download this free ___ on mobile.',
    topicId: 'tech',
    level: 'A2',
    wrongOptions: ['Thiết bị phần cứng', 'Dây cáp sạc', 'Màn hình máy tính'],
  ),
  VocabWord(
    id: 'tc_2',
    word: 'Database',
    meaning: 'Cơ sở dữ liệu',
    pronunciation: '/ˈdeɪ.tə.beɪs/',
    example: 'User accounts are stored securely in a central ___.',
    topicId: 'tech',
    level: 'B1',
    wrongOptions: ['Bàn phím cơ', 'Thiết bị phát Wi-Fi', 'Thẻ nhớ máy ảnh'],
  ),
  VocabWord(
    id: 'tc_3',
    word: 'Security',
    meaning: 'An ninh, bảo mật',
    pronunciation: '/sɪˈkjʊə.rə.ti/',
    example: 'Use strong passwords to protect your online ___.',
    topicId: 'tech',
    level: 'A2',
    wrongOptions: ['Tốc độ mạng', 'Dung lượng lưu trữ', 'Kích thước màn hình'],
  ),
  VocabWord(
    id: 'tc_4',
    word: 'Algorithm',
    meaning: 'Thuật toán',
    pronunciation: '/ˈæl.ɡə.rɪ.ðəm/',
    example: 'Social media uses an ___ to recommend videos.',
    topicId: 'tech',
    level: 'B2',
    wrongOptions: ['Thiết bị đồ họa', 'Nút bấm vật lý', 'Màu sắc giao diện'],
  ),
  VocabWord(
    id: 'tc_5',
    word: 'Device',
    meaning: 'Thiết bị công nghệ',
    pronunciation: '/dɪˈvaɪs/',
    example: 'Connect your smart ___ to the home Wi-Fi.',
    topicId: 'tech',
    level: 'A2',
    wrongOptions: ['Tài khoản cá nhân', 'Mật khẩu bảo vệ', 'Thư điện tử'],
  ),
  VocabWord(
    id: 'tc_6',
    word: 'Interface',
    meaning: 'Giao diện người dùng',
    pronunciation: '/ˈɪn.tə.feɪs/',
    example: 'The app features a clean and modern user ___.',
    topicId: 'tech',
    level: 'B1',
    wrongOptions: ['Bộ vi xử lý', 'Bộ lưu điện khẩn cấp', 'Nhà mạng viễn thông'],
  ),
  VocabWord(
    id: 'tc_7',
    word: 'Update',
    meaning: 'Cập nhật',
    pronunciation: '/ʌpˈdeɪt/',
    example: 'Install the latest software ___ for bug fixes.',
    topicId: 'tech',
    level: 'A1',
    wrongOptions: ['Xóa bỏ tài khoản', 'Khởi động lại nguồn', 'Tắt kết nối mạng'],
  ),
  VocabWord(
    id: 'tc_8',
    word: 'Network',
    meaning: 'Mạng lưới, hệ mạng',
    pronunciation: '/ˈnet.wɜːk/',
    example: 'Check your 5G wireless ___ connection.',
    topicId: 'tech',
    level: 'A2',
    wrongOptions: ['Pin sạc dự phòng', 'Bộ đếm thời gian', 'Tệp âm thanh'],
  ),
  VocabWord(
    id: 'tc_9',
    word: 'Cloud',
    meaning: 'Điện toán đám mây',
    pronunciation: '/klaʊd/',
    example: 'Back up your photos directly to the ___.',
    topicId: 'tech',
    level: 'A2',
    wrongOptions: ['Thẻ cào điện thoại', 'Cổng cắm USB', 'Sách hướng dẫn'],
  ),
  VocabWord(
    id: 'tc_10',
    word: 'Artificial',
    meaning: 'Nhân tạo (như AI)',
    pronunciation: '/ˌɑː.tɪˈfɪʃ.əl/',
    example: 'This app uses ___ intelligence to personalize learning.',
    topicId: 'tech',
    level: 'B2',
    wrongOptions: ['Tự nhiên, hoang dã', 'Cổ điển, truyền thống', 'Thủ công mỹ nghệ'],
  ),

  // Health (10 words)
  VocabWord(
    id: 'ht_1',
    word: 'Symptom',
    meaning: 'Triệu chứng bệnh',
    pronunciation: '/ˈsɪmp.təm/',
    example: 'Fever is a common ___ of the flu.',
    topicId: 'health',
    level: 'B1',
    wrongOptions: ['Phương thuốc chữa trị', 'Bác sĩ chuyên khoa', 'Bảo hiểm y tế'],
  ),
  VocabWord(
    id: 'ht_2',
    word: 'Prescription',
    meaning: 'Đơn thuốc',
    pronunciation: '/prɪˈskrɪp.ʃən/',
    example: 'The doctor wrote a ___ for antibiotics.',
    topicId: 'health',
    level: 'B2',
    wrongOptions: ['Hóa đơn viện phí', 'Giấy ra viện', 'Lịch hẹn phẫu thuật'],
  ),
  VocabWord(
    id: 'ht_3',
    word: 'Patient',
    meaning: 'Bệnh nhân',
    pronunciation: '/ˈpeɪ.ʃənt/',
    example: 'The nurse monitored the ___ closely.',
    topicId: 'health',
    level: 'A2',
    wrongOptions: ['Giám đốc bệnh viện', 'Dược sĩ bán thuốc', 'Thiết bị y tế'],
  ),
  VocabWord(
    id: 'ht_4',
    word: 'Diet',
    meaning: 'Chế độ ăn uống',
    pronunciation: '/ˈdaɪ.ət/',
    example: 'A balanced ___ includes fruits and protein.',
    topicId: 'health',
    level: 'A2',
    wrongOptions: ['Lịch tập thể hình', 'Chế độ ngủ nghỉ', 'Đơn thuốc tây'],
  ),
  VocabWord(
    id: 'ht_5',
    word: 'Infection',
    meaning: 'Sự nhiễm trùng',
    pronunciation: '/ɪnˈfek.ʃən/',
    example: 'Clean the wound carefully to prevent ___.',
    topicId: 'health',
    level: 'B2',
    wrongOptions: ['Sự hồi phục sức khỏe', 'Sự vắc-xin phòng ngừa', 'Sự thư giãn cơ bắp'],
  ),
  VocabWord(
    id: 'ht_6',
    word: 'Treatment',
    meaning: 'Phương pháp điều trị',
    pronunciation: '/ˈtriːt.mənt/',
    example: 'Early ___ can cure many mild illnesses.',
    topicId: 'health',
    level: 'B1',
    wrongOptions: ['Nguyên nhân gây bệnh', 'Lời chẩn đoán sai', 'Chi phí khám bệnh'],
  ),
  VocabWord(
    id: 'ht_7',
    word: 'Exercise',
    meaning: 'Tập luyện thể dục',
    pronunciation: '/ˈek.sə.saɪz/',
    example: 'Regular ___ keeps your heart healthy.',
    topicId: 'health',
    level: 'A1',
    wrongOptions: ['Nghỉ ngơi tĩnh dưỡng', 'Uống thuốc kháng sinh', 'Nằm viện điều trị'],
  ),
  VocabWord(
    id: 'ht_8',
    word: 'Vaccine',
    meaning: 'Vắc-xin tiêm phòng',
    pronunciation: '/ˈvæk.siːn/',
    example: 'Getting a flu ___ helps protect you in winter.',
    topicId: 'health',
    level: 'B1',
    wrongOptions: ['Thuốc giảm đau', 'Thuốc ngậm ho', 'Băng gạc cá nhân'],
  ),
  VocabWord(
    id: 'ht_9',
    word: 'Mental',
    meaning: 'Thuộc về tinh thần',
    pronunciation: '/ˈmen.təl/',
    example: 'Meditation supports good ___ health.',
    topicId: 'health',
    level: 'B1',
    wrongOptions: ['Thuộc về thể chất', 'Thuộc về cơ bắp', 'Thuộc về xương khớp'],
  ),
  VocabWord(
    id: 'ht_10',
    word: 'Hygiene',
    meaning: 'Vệ sinh cá nhân',
    pronunciation: '/ˈhaɪ.dʒiːn/',
    example: 'Good personal ___ prevents the spread of germs.',
    topicId: 'health',
    level: 'B2',
    wrongOptions: ['Thói quen ăn tiệc', 'Chế độ ăn kiêng', 'Sự tập luyện nặng'],
  ),

  // Business English (10 words)
  VocabWord(
    id: 'bs_1',
    word: 'Contract',
    meaning: 'Hợp đồng kinh doanh',
    pronunciation: '/ˈkɒn.trækt/',
    example: 'Both partners signed the legal ___ yesterday.',
    topicId: 'business',
    level: 'B1',
    wrongOptions: ['Lịch họp nội bộ', 'Báo cáo doanh thu', 'Thư mời tham dự'],
  ),
  VocabWord(
    id: 'bs_2',
    word: 'Negotiate',
    meaning: 'Đàm phán, thương lượng',
    pronunciation: '/nəˈɡəʊ.ʃi.eɪt/',
    example: 'We are trying to ___ a better price.',
    topicId: 'business',
    level: 'B2',
    wrongOptions: ['Hủy bỏ thỏa thuận', 'Nộp thuế doanh nghiệp', 'Tăng lương nhân viên'],
  ),
  VocabWord(
    id: 'bs_3',
    word: 'Revenue',
    meaning: 'Doanh thu',
    pronunciation: '/ˈrev.ən.juː/',
    example: 'Annual company ___ grew by fifteen percent.',
    topicId: 'business',
    level: 'B2',
    wrongOptions: ['Chi phí phát sinh', 'Khoản lỗ kinh doanh', 'Lương cố định'],
  ),
  VocabWord(
    id: 'bs_4',
    word: 'Investment',
    meaning: 'Khoản đầu tư',
    pronunciation: '/ɪnˈvest.mənt/',
    example: 'Buying technology stocks is a long-term ___.',
    topicId: 'business',
    level: 'B1',
    wrongOptions: ['Khoản nợ phải trả', 'Tiền bảo hiểm', 'Lương hưu hàng tháng'],
  ),
  VocabWord(
    id: 'bs_5',
    word: 'Strategy',
    meaning: 'Chiến lược kinh doanh',
    pronunciation: '/ˈstræt.ə.dʒi/',
    example: 'The board developed a new marketing ___.',
    topicId: 'business',
    level: 'B1',
    wrongOptions: ['Sản phẩm tồn kho', 'Bản thống kê giờ làm', 'Hóa đơn tiền điện'],
  ),
  VocabWord(
    id: 'bs_6',
    word: 'Profit',
    meaning: 'Lợi nhuận',
    pronunciation: '/ˈprɒf.ɪt/',
    example: 'Higher sales led to a record quarterly ___.',
    topicId: 'business',
    level: 'A2',
    wrongOptions: ['Thất thoát tài sản', 'Chi phí quảng cáo', 'Sự vỡ nợ'],
  ),
  VocabWord(
    id: 'bs_7',
    word: 'Market',
    meaning: 'Thị trường',
    pronunciation: '/ˈmɑː.kɪt/',
    example: 'Our products target the Asian consumer ___.',
    topicId: 'business',
    level: 'A1',
    wrongOptions: ['Phòng nhân sự', 'Kho chứa hàng', 'Xe vận chuyển'],
  ),
  VocabWord(
    id: 'bs_8',
    word: 'Client',
    meaning: 'Khách hàng đối tác',
    pronunciation: '/ˈklaɪ.ənt/',
    example: 'We met with a new corporate ___ today.',
    topicId: 'business',
    level: 'A2',
    wrongOptions: ['Chủ sở hữu cổ phần', 'Thực tập sinh', 'Cơ quan nhà nước'],
  ),
  VocabWord(
    id: 'bs_9',
    word: 'Merger',
    meaning: 'Sự sáp nhập doanh nghiệp',
    pronunciation: '/ˈmɜː.dʒər/',
    example: 'The corporate ___ created the largest bank.',
    topicId: 'business',
    level: 'B2',
    wrongOptions: ['Sự giải thể công ty', 'Sự sa thải hàng loạt', 'Buổi khánh thành'],
  ),
  VocabWord(
    id: 'bs_10',
    word: 'Budget',
    meaning: 'Ngân sách',
    pronunciation: '/ˈbʌdʒ.ɪt/',
    example: 'We must keep our project expenses within ___.',
    topicId: 'business',
    level: 'B1',
    wrongOptions: ['Mã số thuế', 'Hóa đơn GTGT', 'Bằng sáng chế'],
  ),
];
`
  },
  {
    path: 'lib/services/storage_service.dart',
    category: 'services',
    description: 'Dịch vụ lưu trữ dữ liệu local bằng SharedPreferences',
    code: `import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  static late SharedPreferences _prefs;

  static const String _keySound = 'sound_enabled';
  static const String _keyDark = 'dark_mode';
  static const String _keyTotalQuizzes = 'total_quizzes';
  static const String _keyTotalCorrect = 'total_correct';
  static const String _keyTotalQuestions = 'total_questions';
  static const String _keyHighScore = 'high_score';
  static const String _keyStreakDays = 'streak_days';
  static const String _keyLastActiveDate = 'last_active_date';
  static const String _keyWrongWords = 'wrong_words_json';

  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
    _checkStreak();
  }

  static bool getSoundEnabled() => _prefs.getBool(_keySound) ?? true;
  static Future<void> setSoundEnabled(bool value) => _prefs.setBool(_keySound, value);

  static bool getDarkMode() => _prefs.getBool(_keyDark) ?? false;
  static Future<void> setDarkMode(bool value) => _prefs.setBool(_keyDark, value);

  static int getTotalQuizzes() => _prefs.getInt(_keyTotalQuizzes) ?? 0;
  static int getTotalCorrect() => _prefs.getInt(_keyTotalCorrect) ?? 0;
  static int getTotalQuestions() => _prefs.getInt(_keyTotalQuestions) ?? 0;
  static int getHighScore() => _prefs.getInt(_keyHighScore) ?? 0;
  static int getStreakDays() => _prefs.getInt(_keyStreakDays) ?? 1;

  static void _checkStreak() {
    String today = DateTime.now().toIso8601String().split('T')[0];
    String? lastActive = _prefs.getString(_keyLastActiveDate);

    if (lastActive == null) {
      _prefs.setString(_keyLastActiveDate, today);
      _prefs.setInt(_keyStreakDays, 1);
      return;
    }

    if (lastActive != today) {
      DateTime lastDate = DateTime.parse(lastActive);
      DateTime todayDate = DateTime.parse(today);
      int diff = todayDate.difference(lastDate).inDays;

      if (diff == 1) {
        int currentStreak = getStreakDays() + 1;
        _prefs.setInt(_keyStreakDays, currentStreak);
      } else if (diff > 1) {
        _prefs.setInt(_keyStreakDays, 1);
      }
      _prefs.setString(_keyLastActiveDate, today);
    }
  }

  static Future<void> recordQuizResult({
    required int correctCount,
    required int totalCount,
    required List<Map<String, dynamic>> wrongWords,
  }) async {
    int totalQ = getTotalQuizzes() + 1;
    int totalC = getTotalCorrect() + correctCount;
    int totalAllQ = getTotalQuestions() + totalCount;
    int pct = ((correctCount / totalCount) * 100).round();

    await _prefs.setInt(_keyTotalQuizzes, totalQ);
    await _prefs.setInt(_keyTotalCorrect, totalC);
    await _prefs.setInt(_keyTotalQuestions, totalAllQ);

    if (pct > getHighScore()) {
      await _prefs.setInt(_keyHighScore, pct);
    }

    // Save wrong words
    List<Map<String, dynamic>> currentWrong = getWrongWords();
    for (var w in wrongWords) {
      int idx = currentWrong.indexWhere((element) => element['id'] == w['id']);
      if (idx >= 0) {
        currentWrong[idx]['wrongCount'] = (currentWrong[idx]['wrongCount'] ?? 1) + 1;
      } else {
        w['wrongCount'] = 1;
        currentWrong.add(w);
      }
    }
    await _prefs.setString(_keyWrongWords, jsonEncode(currentWrong));
  }

  static List<Map<String, dynamic>> getWrongWords() {
    String? raw = _prefs.getString(_keyWrongWords);
    if (raw == null) return [];
    try {
      List decoded = jsonDecode(raw);
      return decoded.map((e) => Map<String, dynamic>.from(e)).toList();
    } catch (_) {
      return [];
    }
  }

  static Future<void> removeWrongWord(String id) async {
    List<Map<String, dynamic>> current = getWrongWords();
    current.removeWhere((item) => item['id'] == id);
    await _prefs.setString(_keyWrongWords, jsonEncode(current));
  }

  static Future<void> resetProgress() async {
    await _prefs.clear();
  }
}
`
  },
  {
    path: 'lib/services/sound_service.dart',
    category: 'services',
    description: 'Dịch vụ phát âm thanh câu trả lời đúng/sai và Text-To-Speech giọng nói tiếng Anh',
    code: `import 'package:flutter_tts/flutter_tts.dart';
import 'package:audioplayers/audioplayers.dart';
import 'storage_service.dart';

class SoundService {
  static final FlutterTts _tts = FlutterTts();
  static final AudioPlayer _audioPlayer = AudioPlayer();

  static Future<void> speakWord(String text) async {
    if (!StorageService.getSoundEnabled()) return;
    await _tts.setLanguage("en-US");
    await _tts.setSpeechRate(0.85);
    await _tts.setPitch(1.0);
    await _tts.speak(text);
  }

  static Future<void> playCorrectSound() async {
    if (!StorageService.getSoundEnabled()) return;
    try {
      await _audioPlayer.play(AssetSource('sounds/correct.mp3'));
    } catch (_) {}
  }

  static Future<void> playWrongSound() async {
    if (!StorageService.getSoundEnabled()) return;
    try {
      await _audioPlayer.play(AssetSource('sounds/wrong.mp3'));
    } catch (_) {}
  }
}
`
  },
  {
    path: 'lib/theme/app_theme.dart',
    category: 'theme',
    description: 'Cấu hình giao diện Light & Dark Mode hiện đại, màu sắc trẻ trung',
    code: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color primaryColor = Color(0xFF4F46E5); // Indigo 600
  static const Color accentColor = Color(0xFF10B981);  // Emerald 500
  static const Color warningColor = Color(0xFFF59E0B); // Amber 500
  static const Color errorColor = Color(0xFFEF4444);   // Red 500

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    colorScheme: ColorScheme.fromSeed(
      seedColor: primaryColor,
      brightness: Brightness.light,
      primary: primaryColor,
      secondary: accentColor,
      background: const Color(0xFFF8FAFC),
      surface: Colors.white,
    ),
    scaffoldBackgroundColor: const Color(0xFFF8FAFC),
    cardTheme: CardTheme(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      color: Colors.white,
    ),
    textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.light().textTheme),
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.white,
      elevation: 0,
      centerTitle: true,
      iconTheme: IconThemeData(color: Color(0xFF0F172A)),
      titleTextStyle: TextStyle(
        color: Color(0xFF0F172A),
        fontSize: 18,
        fontWeight: FontWeight.bold,
      ),
    ),
  );

  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: ColorScheme.fromSeed(
      seedColor: primaryColor,
      brightness: Brightness.dark,
      primary: const Color(0xFF6366F1),
      secondary: accentColor,
      background: const Color(0xFF0F172A),
      surface: const Color(0xFF1E293B),
    ),
    scaffoldBackgroundColor: const Color(0xFF0F172A),
    cardTheme: CardTheme(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      color: const Color(0xFF1E293B),
    ),
    textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.dark().textTheme),
    appBarTheme: const AppBarTheme(
      backgroundColor: Color(0xFF1E293B),
      elevation: 0,
      centerTitle: true,
      iconTheme: IconThemeData(color: Colors.white),
      titleTextStyle: TextStyle(
        color: Colors.white,
        fontSize: 18,
        fontWeight: FontWeight.bold,
      ),
    ),
  );
}
`
  },
  {
    path: 'lib/screens/main_navigation_screen.dart',
    category: 'screens',
    description: 'Thanh điều hướng Bottom Navigation gồm 5 tab theo yêu cầu',
    code: `import 'package:flutter/material.dart';
import 'welcome_screen.dart';
import 'topics_screen.dart';
import 'wrong_words_screen.dart';
import 'progress_screen.dart';
import 'settings_screen.dart';

class MainNavigationScreen extends StatefulWidget {
  final Function(bool) onToggleTheme;
  const MainNavigationScreen({super.key, required this.onToggleTheme});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final List<Widget> pages = [
      WelcomeScreen(onStartLearning: () => setState(() => _currentIndex = 1)),
      const TopicsScreen(),
      const WrongWordsScreen(),
      const ProgressScreen(),
      SettingsScreen(onToggleTheme: widget.onToggleTheme),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: pages,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (idx) => setState(() => _currentIndex = idx),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Trang chủ'),
          NavigationDestination(icon: Icon(Icons.style_outlined), selectedIcon: Icon(Icons.style), label: 'Quiz'),
          NavigationDestination(icon: Icon(Icons.bookmark_outline), selectedIcon: Icon(Icons.bookmark), label: 'Từ sai'),
          NavigationDestination(icon: Icon(Icons.insights_outlined), selectedIcon: Icon(Icons.insights), label: 'Tiến độ'),
          NavigationDestination(icon: Icon(Icons.settings_outlined), selectedIcon: Icon(Icons.settings), label: 'Cài đặt'),
        ],
      ),
    );
  }
}
`
  },
  {
    path: 'android/app/src/main/AndroidManifest.xml',
    category: 'android',
    description: 'Cấu hình AndroidManifest chuẩn sẵn sàng upload Google Play',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.quizvocab">

    <!-- Chỉ yêu cầu quyền cơ bản không nhạy cảm -->
    <uses-permission android:name="android.permission.INTERNET"/>

    <application
        android:label="Quiz Vocab"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher"
        android:allowBackup="true"
        android:fullBackupContent="true"
        android:supportsRtl="true"
        android:theme="@style/LaunchTheme">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:taskAffinity=""
            android:theme="@style/NormalTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            
            <meta-data
              android:name="io.flutter.embedding.android.NormalTheme"
              android:resource="@style/NormalTheme"
              />
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        
        <meta-data
            android:name="flutterEmbedding"
            android:value="2" />
    </application>
</manifest>
`
  },
  {
    path: 'android/app/build.gradle.kts',
    category: 'android',
    description: 'Cấu hình Gradle Release App Bundle .aab',
    code: `plugins {
    id("com.android.application")
    id("kotlin-android")
    id("dev.flutter.flutter-gradle-plugin")
}

android {
    namespace = "com.example.quizvocab"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.quizvocab"
        minSdk = 21
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            // Tối ưu mã nguồn và giảm dung lượng app .aab
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            signingConfig = signingConfigs.getByName("debug") // Thay bằng keystore thật khi release
        }
    }
}

flutter {
    source = "../.."
}
`
  },
  {
    path: 'GOOGLE_PLAY_GUIDE.md',
    category: 'guide',
    description: 'Hướng dẫn chi tiết build .aab và bộ thông tin xuất bản lên Google Play Console',
    code: `# Hướng Dẫn Build .AAB & Upload Lên Google Play Console

## 1. Đổi Package Name và App Name
Nếu muốn đổi package name sang tên cá nhân/công ty (ví dụ: \`com.yourdomain.quizvocab\`):
1. Chạy lệnh: \`flutter pub run change_app_package_name:main com.yourdomain.quizvocab\`
2. Hoặc cập nhật thủ công tại:
   - \`android/app/build.gradle.kts\` (\`applicationId = "com.yourdomain.quizvocab"\`)
   - \`android/app/src/main/AndroidManifest.xml\` (\`package="com.yourdomain.quizvocab"\`)

## 2. Tạo Keystore ký ứng dụng (Release Key)
Chạy lệnh trong Terminal:
\`\`\`bash
keytool -genkey -v -keystore android/app/upload-keystore.jks -storetype JKS -keyalg RSA -keysize 2048 -validity 10000 -alias key
\`\`\`
Tạo file \`android/key.properties\` với nội dung:
\`\`\`properties
storePassword=your_password
keyPassword=your_password
keyAlias=key
storeFile=upload-keystore.jks
\`\`\`

## 3. Lệnh Build Android App Bundle (.aab)
Mở Terminal tại thư mục dự án Flutter và thực hiện:
\`\`\`bash
flutter clean
flutter pub get
flutter build appbundle --release
\`\`\`
File \`.aab\` sẽ được tạo ra tại:
\`build/app/outputs/bundle/release/app-release.aab\`

---

# Thông Tin Xuất Bản Google Play Console (Store Listing)

### Tên Ứng Dụng (App Title)
**Quiz Vocab - Học Từ Vựng Anh** (Dưới 30 ký tự)

### Mô tả ngắn (Short Description)
Học 1000+ từ vựng tiếng Anh qua câu hỏi trắc nghiệm thông minh, theo dõi chuỗi streak và ôn luyện từ sai hiệu quả.

### Mô tả đầy đủ (Full Description)
Quiz Vocab là ứng dụng học từ vựng tiếng Anh trắc nghiệm toàn diện dành cho học sinh, sinh viên và người đi làm từ trình độ A1 đến B2.

🌟 TÍNH NĂNG NỔI BẬT:
• 8 Chủ đề thông dụng: Cuộc sống hàng ngày, Trường học, Công việc, Du lịch, Ẩm thực, Công nghệ, Sức khỏe, Tiếng Anh thương mại.
• 3 Dạng câu hỏi phong phú: Chọn nghĩa đúng, Tìm từ tiếng Anh, Điền từ vào câu ví dụ.
• Chế độ ôn tập từ sai: Tự động lưu các từ bạn trả lời sai để luyện tập riêng cho đến khi thuộc lòng.
• Thống kê tiến độ & Chuỗi Streak: Theo dõi số câu đúng, tỷ lệ chính xác và giữ vững thói quen học mỗi ngày.
• Phát âm chuẩn giọng Anh-Mỹ: Tích hợp đọc từ vựng và câu ví dụ sinh động.
• Giao diện hiện đại, tối giản: Hỗ trợ chế độ Sáng (Light) và Tối (Dark mode) dịu mắt.
• Hoàn toàn không cần Internet: Học mọi lúc mọi nơi, bảo mật dữ liệu local 100%.

Hãy tải Quiz Vocab ngay hôm nay để nâng trình từ vựng tiếng Anh mỗi ngày!

### Từ khóa tìm kiếm (Keywords)
hoc tu vung tieng anh, quiz vocab, trac nghiem tieng anh, tu vung tieng anh a1 b2, flashcard tieng anh, tu vung tieng anh giao tiep, luyen thi tieng anh, app hoc tu vung.

### Gợi ý Ảnh Chụp Màn Hình (Screenshots)
1. Screenshot 1: Màn hình chào mừng & Chọn 8 chủ đề sinh động.
2. Screenshot 2: Màn hình Quiz với 4 đáp án & âm thanh đúng/sai.
3. Screenshot 3: Màn hình Kết quả Quiz & Xếp loại Xuất sắc/Tốt.
4. Screenshot 4: Màn hình Từ cần ôn lại (Wrong Words).
5. Screenshot 5: Biểu đồ Tiến độ học tập & Streak tích lũy.
`
  }
];
