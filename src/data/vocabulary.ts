import { Topic, VocabWord } from '../types';

export const TOPICS: Topic[] = [
  {
    id: 'everyday',
    title: 'Everyday Life',
    titleVi: 'Cuộc sống hàng ngày',
    icon: 'Sun',
    questionCount: 10,
    level: 'A1 - A2',
    description: 'Từ vựng quen thuộc về thói quen, nhà cửa và hoạt động thường nhật.',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'school',
    title: 'School',
    titleVi: 'Trường học & Giáo dục',
    icon: 'GraduationCap',
    questionCount: 10,
    level: 'A1 - B1',
    description: 'Từ vựng môn học, dụng cụ học tập và môi trường giáo dục.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'work',
    title: 'Work',
    titleVi: 'Công việc & Văn phòng',
    icon: 'Briefcase',
    questionCount: 10,
    level: 'A2 - B2',
    description: 'Từ vựng môi trường công sở, giao tiếp đồng nghiệp và họp hành.',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'travel',
    title: 'Travel',
    titleVi: 'Du lịch & Di chuyển',
    icon: 'Plane',
    questionCount: 10,
    level: 'A2 - B1',
    description: 'Từ vựng sân bay, khách sạn, hỏi đường và di chuyển.',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'food',
    title: 'Food',
    titleVi: 'Ẩm thực & Nhà hàng',
    icon: 'Utensils',
    questionCount: 10,
    level: 'A1 - A2',
    description: 'Từ vựng món ăn, đồ uống, hương vị và đặt bàn nhà hàng.',
    color: 'from-rose-500 to-red-500'
  },
  {
    id: 'tech',
    title: 'Technology',
    titleVi: 'Công nghệ & Internet',
    icon: 'Laptop',
    questionCount: 10,
    level: 'A2 - B2',
    description: 'Từ vựng máy tính, phần mềm, mạng xã hội và thiết bị thông minh.',
    color: 'from-sky-500 to-indigo-600'
  },
  {
    id: 'health',
    title: 'Health',
    titleVi: 'Sức khỏe & Y tế',
    icon: 'HeartPulse',
    questionCount: 10,
    level: 'A2 - B2',
    description: 'Từ vựng cơ thể, triệu chứng bệnh, tập luyện và dinh dưỡng.',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'business',
    title: 'Business English',
    titleVi: 'Tiếng Anh Thương mại',
    icon: 'TrendingUp',
    questionCount: 10,
    level: 'B1 - B2',
    description: 'Từ vựng tài chính, hợp đồng, tiếp thị và thương lượng kinh doanh.',
    color: 'from-violet-500 to-fuchsia-600'
  }
];

export const VOCAB_DATA: VocabWord[] = [
  // 1. Everyday Life (10 words)
  {
    id: 'ev_1',
    word: 'Routine',
    meaning: 'Thói quen hằng ngày',
    pronunciation: '/ruːˈtiːn/',
    example: 'My daily ___ includes morning exercise and reading.',
    topicId: 'everyday',
    level: 'A2',
    wrongOptions: ['Chuyến đi du lịch', 'Kế hoạch tài chính', 'Món ăn yêu thích']
  },
  {
    id: 'ev_2',
    word: 'Neighbourhood',
    meaning: 'Khu xóm, hàng xóm',
    pronunciation: '/ˈneɪ.bə.hʊd/',
    example: 'Our ___ is quiet and very safe for children.',
    topicId: 'everyday',
    level: 'A2',
    wrongOptions: ['Tòa nhà văn phòng', 'Khu trung tâm thương mại', 'Sân bay quốc tế']
  },
  {
    id: 'ev_3',
    word: 'Appliance',
    meaning: 'Thiết bị gia dụng',
    pronunciation: '/əˈplaɪ.əns/',
    example: 'The refrigerator is a vital kitchen ___.',
    topicId: 'everyday',
    level: 'B1',
    wrongOptions: ['Dụng cụ thể thao', 'Phần mềm máy tính', 'Quần áo thời trang']
  },
  {
    id: 'ev_4',
    word: 'Leisure',
    meaning: 'Thời gian rảnh rỗi',
    pronunciation: '/ˈleʒ.ər/',
    example: 'Reading novels is my favorite ___ activity.',
    topicId: 'everyday',
    level: 'B1',
    wrongOptions: ['Áp lực công việc', 'Giờ học căng thẳng', 'Chi phí sinh hoạt']
  },
  {
    id: 'ev_5',
    word: 'Chore',
    meaning: 'Việc nhà lặt vặt',
    pronunciation: '/tʃɔːr/',
    example: 'Washing dishes is a daily household ___.',
    topicId: 'everyday',
    level: 'A2',
    wrongOptions: ['Chuyến công tác', 'Trò chơi giải trí', 'Buổi trình diễn']
  },
  {
    id: 'ev_6',
    word: 'Convenient',
    meaning: 'Tiện lợi, thuận tiện',
    pronunciation: '/kənˈviː.ni.ənt/',
    example: 'Living near the subway is extremely ___.',
    topicId: 'everyday',
    level: 'A2',
    wrongOptions: ['Phức tạp, rắc rối', 'Tốn kém, đắt đỏ', 'Xa xôi, hẻo lánh']
  },
  {
    id: 'ev_7',
    word: 'Grateful',
    meaning: 'Biết ơn, cảm kích',
    pronunciation: '/ˈɡreɪt.fəl/',
    example: 'I am ___ for your kind support today.',
    topicId: 'everyday',
    level: 'A2',
    wrongOptions: ['Tức giận, bất bình', 'Thất vọng, chán nản', 'Lo lắng, sợ hãi']
  },
  {
    id: 'ev_8',
    word: 'Punctual',
    meaning: 'Đúng giờ',
    pronunciation: '/ˈpʌŋk.tʃu.əl/',
    example: 'She is always ___ for family dinners.',
    topicId: 'everyday',
    level: 'B1',
    wrongOptions: ['Trễ hẹn, muộn màng', 'Lười biếng, uể uải', 'Hấp vội, vội vã']
  },
  {
    id: 'ev_9',
    word: 'Commute',
    meaning: 'Đi lại hàng ngày (đi làm/đi học)',
    pronunciation: '/kəˈmjuːt/',
    example: 'My morning ___ takes about thirty minutes by bus.',
    topicId: 'everyday',
    level: 'B1',
    wrongOptions: ['Cuộc trò chuyện ngắn', 'Nghỉ ngơi cuối tuần', ' Mua sắm tạp hóa']
  },
  {
    id: 'ev_10',
    word: 'Comfortable',
    meaning: 'Thoải mái, dễ chịu',
    pronunciation: '/ˈkʌm.fə.tə.bəl/',
    example: 'This new sofa is very ___ to sit on.',
    topicId: 'everyday',
    level: 'A1',
    wrongOptions: ['Cứng đờ, khó chịu', 'Bẩn thỉu, xập xệ', 'Chật chội, tù túng']
  },

  // 2. School (10 words)
  {
    id: 'sch_1',
    word: 'Assignment',
    meaning: 'Bài tập được giao',
    pronunciation: '/əˈsaɪn.mənt/',
    example: 'We must submit our history ___ by Friday.',
    topicId: 'school',
    level: 'A2',
    wrongOptions: ['Lịch nghỉ hè', 'Thẻ thư viện', 'Bộ đồng phục']
  },
  {
    id: 'sch_2',
    word: 'Curriculum',
    meaning: 'Chương trình giảng dạy',
    pronunciation: '/kəˈrɪk.jə.ləm/',
    example: 'The school updated its science ___ this year.',
    topicId: 'school',
    level: 'B2',
    wrongOptions: ['Bảng điểm cá nhân', 'Phòng thí nghiệm', 'Xe đưa đón học sinh']
  },
  {
    id: 'sch_3',
    word: 'Scholarship',
    meaning: 'Học bổng',
    pronunciation: '/ˈskɒl.ə.ʃɪp/',
    example: 'She won a full ___ to study at university.',
    topicId: 'school',
    level: 'B1',
    wrongOptions: ['Học phí hàng tháng', 'Giấy phép vắng học', 'Sổ liên lạc phu huynh']
  },
  {
    id: 'sch_4',
    word: 'Lecture',
    meaning: 'Bài giảng, buổi diễn thuyết',
    pronunciation: '/ˈlek.tʃər/',
    example: 'The professor gave an inspiring ___ today.',
    topicId: 'school',
    level: 'A2',
    wrongOptions: ['Kỳ thi tốt nghiệp', 'Trận đấu thể thao', 'Buổi sinh hoạt lớp']
  },
  {
    id: 'sch_5',
    word: 'Graduate',
    meaning: 'Tốt nghiệp',
    pronunciation: '/ˈɡrædʒ.u.eɪt/',
    example: 'He will ___ from high school next month.',
    topicId: 'school',
    level: 'A2',
    wrongOptions: ['Nhập học, ghi danh', 'Bỏ học giữa chừng', 'Thi lại môn học']
  },
  {
    id: 'sch_6',
    word: 'Laboratory',
    meaning: 'Phòng thí nghiệm',
    pronunciation: '/ləˈbɒr.ə.tər.i/',
    example: 'Students wear safety glasses in the chemistry ___.',
    topicId: 'school',
    level: 'B1',
    wrongOptions: ['Sân vận động', 'Căng tin trường học', 'Phòng ban giám hiệu']
  },
  {
    id: 'sch_7',
    word: 'Academic',
    meaning: 'Thuộc về học thuật, học tập',
    pronunciation: '/ˌæk.əˈdem.ɪk/',
    example: 'The school has very high ___ standards.',
    topicId: 'school',
    level: 'B1',
    wrongOptions: ['Mang tính giải trí', 'Thuộc về kinh doanh', 'Mang tính thể thao']
  },
  {
    id: 'sch_8',
    word: 'Dormitory',
    meaning: 'Ký túc xá',
    pronunciation: '/ˈdɔː.mɪ.tər.i/',
    example: 'Freshmen usually live in the university ___.',
    topicId: 'school',
    level: 'B1',
    wrongOptions: ['Nhà hội trường', 'Thư viện trung tâm', 'Bãi đỗ xe sinh viên']
  },
  {
    id: 'sch_9',
    word: 'Syllabus',
    meaning: 'Đề cương môn học',
    pronunciation: '/ˈsɪl.ə.bəs/',
    example: 'Check the ___ to see grading policies.',
    topicId: 'school',
    level: 'B2',
    wrongOptions: ['Bằng cấp chính thức', 'Phiếu ăn căng tin', 'Nội quy nhà trường']
  },
  {
    id: 'sch_10',
    word: 'Tutor',
    meaning: 'Gia sư, trợ giảng',
    pronunciation: '/ˈtʃuː.tər/',
    example: 'A private ___ helped him pass math.',
    topicId: 'school',
    level: 'A2',
    wrongOptions: ['Hiệu trưởng', 'Bảo vệ trường', 'Bạn cùng lớp']
  },

  // 3. Work (10 words)
  {
    id: 'wk_1',
    word: 'Deadline',
    meaning: 'Hạn chót',
    pronunciation: '/ˈded.laɪn/',
    example: 'We must finish the project before the ___.',
    topicId: 'work',
    level: 'A2',
    wrongOptions: ['Giờ nghỉ trưa', 'Lương thưởng', 'Hợp đồng thử việc']
  },
  {
    id: 'wk_2',
    word: 'Promotion',
    meaning: 'Thăng chức, thăng tiến',
    pronunciation: '/prəˈməʊ.ʃən/',
    example: 'Her hard work earned her a big ___.',
    topicId: 'work',
    level: 'B1',
    wrongOptions: ['Việc sa thải', 'Sự xin nghỉ phép', 'Lỗi kỹ thuật']
  },
  {
    id: 'wk_3',
    word: 'Colleague',
    meaning: 'Đồng nghiệp',
    pronunciation: '/ˈkɒl.iːɡ/',
    example: 'I have a meeting with my senior ___ at 2 PM.',
    topicId: 'work',
    level: 'A2',
    wrongOptions: ['Khách hàng cá nhân', 'Đối thủ cạnh tranh', 'Nhà cung cấp']
  },
  {
    id: 'wk_4',
    word: 'Salary',
    meaning: 'Tiền lương',
    pronunciation: '/ˈsæl.ər.i/',
    example: 'The company offers a competitive monthly ___.',
    topicId: 'work',
    level: 'A1',
    wrongOptions: ['Bàn làm việc', 'Quy trình tuyển dụng', 'Bộ hồ sơ xin việc']
  },
  {
    id: 'wk_5',
    word: 'Interview',
    meaning: 'Phỏng vấn',
    pronunciation: '/ˈɪn.tə.vjuː/',
    example: 'He wore a formal suit for his job ___.',
    topicId: 'work',
    level: 'A2',
    wrongOptions: ['Buổi tiệc chia tay', 'Lễ ký hợp đồng', 'Giờ tăng ca']
  },
  {
    id: 'wk_6',
    word: 'Department',
    meaning: 'Phòng ban',
    pronunciation: '/dɪˈpɑːt.mənt/',
    example: 'She works in the marketing ___.',
    topicId: 'work',
    level: 'A2',
    wrongOptions: ['Chi nhánh nước ngoài', 'Bãi đỗ xe công ty', 'Trụ sở chính']
  },
  {
    id: 'wk_7',
    word: 'Productivity',
    meaning: 'Năng suất làm việc',
    pronunciation: '/ˌprɒd.ʌkˈtɪv.ə.ti/',
    example: 'Short breaks can improve overall workplace ___.',
    topicId: 'work',
    level: 'B2',
    wrongOptions: ['Sự mệt mỏi', 'Tỷ lệ thất nghiệp', 'Khoản chi phí phát sinh']
  },
  {
    id: 'wk_8',
    word: 'Resign',
    meaning: 'Từ chức, xin nghỉ việc',
    pronunciation: '/rɪˈzaɪn/',
    example: 'He decided to ___ to start his own business.',
    topicId: 'work',
    level: 'B1',
    wrongOptions: ['Ký hợp đồng mới', 'Nộp hồ sơ xin việc', 'Nhận thưởng quý']
  },
  {
    id: 'wk_9',
    word: 'Supervisor',
    meaning: 'Người giám sát, quản lý',
    pronunciation: '/ˈsuː.pə.vaɪ.zər/',
    example: 'Report any problems directly to your ___.',
    topicId: 'work',
    level: 'B1',
    wrongOptions: ['Thực tập sinh', 'Bảo vệ tòa nhà', 'Lễ tân công ty']
  },
  {
    id: 'wk_10',
    word: 'Task',
    meaning: 'Nhiệm vụ, công việc',
    pronunciation: '/tɑːsk/',
    example: 'Each team member was assigned a specific ___.',
    topicId: 'work',
    level: 'A1',
    wrongOptions: ['Phòng họp kín', 'Chương trình khuyến mãi', 'Cuộc gọi cá nhân']
  },

  // 4. Travel (10 words)
  {
    id: 'tr_1',
    word: 'Destination',
    meaning: 'Điểm đến',
    pronunciation: '/ˌdes.tɪˈneɪ.ʃən/',
    example: 'Paris is a popular tourist ___ in Western Europe.',
    topicId: 'travel',
    level: 'A2',
    wrongOptions: ['Điểm xuất phát', 'Vé máy bay khứ hồi', 'Hành lý ký gửi']
  },
  {
    id: 'tr_2',
    word: 'Passport',
    meaning: 'Hộ chiếu',
    pronunciation: '/ˈpɑːs.pɔːt/',
    example: 'You must show your valid ___ at border control.',
    topicId: 'travel',
    level: 'A1',
    wrongOptions: ['Thẻ tín dụng', 'Thẻ căn cước công dân', 'Vé xe buýt']
  },
  {
    id: 'tr_3',
    word: 'Itinerary',
    meaning: 'Lịch trình chuyến đi',
    pronunciation: '/aɪˈtɪn.ər.ər.i/',
    example: 'The travel agent gave us a detailed travel ___.',
    topicId: 'travel',
    level: 'B2',
    wrongOptions: ['Bản đồ du lịch', 'Hóa đơn khách sạn', 'Bảo hiểm du lịch']
  },
  {
    id: 'tr_4',
    word: 'Luggage',
    meaning: 'Hành lý',
    pronunciation: '/ˈlʌɡ.ɪdʒ/',
    example: 'Please do not leave your ___ unattended at airport.',
    topicId: 'travel',
    level: 'A2',
    wrongOptions: ['Phương tiện đi lại', 'Món ăn đặc sản', 'Quà lưu niệm']
  },
  {
    id: 'tr_5',
    word: 'Accommodation',
    meaning: 'Chỗ ở (khách sạn, nhà nghỉ)',
    pronunciation: '/əˌkɒm.əˈdeɪ.ʃən/',
    example: 'We booked our hotel ___ online in advance.',
    topicId: 'travel',
    level: 'B1',
    wrongOptions: ['Dịch vụ cho thuê xe', 'Tài xế bản địa', 'Địa điểm tham quan']
  },
  {
    id: 'tr_6',
    word: 'Souvenir',
    meaning: 'Quà lưu niệm',
    pronunciation: '/ˌsuː.vənˈɪər/',
    example: 'I bought a hand-crafted keychain as a ___.',
    topicId: 'travel',
    level: 'A2',
    wrongOptions: ['Thực đơn nhà hàng', 'Bản đồ thành phố', 'Thẻ phòng khách sạn']
  },
  {
    id: 'tr_7',
    word: 'Boarding',
    meaning: 'Sự lên tàu/máy bay',
    pronunciation: '/ˈbɔː.dɪŋ/',
    example: 'Passengers are requested to proceed to gate 5 for ___.',
    topicId: 'travel',
    level: 'B1',
    wrongOptions: ['Sự hạ cánh', 'Sự hoãn chuyến', 'Sự đổi tiền tệ']
  },
  {
    id: 'tr_8',
    word: 'Customs',
    meaning: 'Hải quan',
    pronunciation: '/ˈkʌs.təmz/',
    example: 'All foreign travelers must clear ___ at the airport.',
    topicId: 'travel',
    level: 'B1',
    wrongOptions: ['Dịch vụ taxi', 'Bàn hướng dẫn du lịch', 'Phòng chờ thương gia']
  },
  {
    id: 'tr_9',
    word: 'Sightseeing',
    meaning: 'Sự ngắm cảnh, tham quan',
    pronunciation: '/ˈsaɪtˌsiː.ɪŋ/',
    example: 'We went on a bus tour for day-long ___.',
    topicId: 'travel',
    level: 'A2',
    wrongOptions: ['Chuyến đi công tác', 'Mua sắm siêu thị', 'Đổ xăng xe']
  },
  {
    id: 'tr_10',
    word: 'Delay',
    meaning: 'Sự trì hoãn, trễ chuyến',
    pronunciation: '/dɪˈleɪ/',
    example: 'Bad weather caused a two-hour flight ___.',
    topicId: 'travel',
    level: 'A2',
    wrongOptions: ['Khởi hành đúng giờ', 'Hạ cánh khẩn cấp', 'Đổi chỗ ngồi']
  },

  // 5. Food (10 words)
  {
    id: 'fd_1',
    word: 'Recipe',
    meaning: 'Công thức nấu ăn',
    pronunciation: '/ˈres.ɪ.pi/',
    example: 'Follow this simple ___ to make delicious soup.',
    topicId: 'food',
    level: 'A2',
    wrongOptions: ['Hóa đơn thanh toán', 'Thực đơn đồ uống', 'Thiết bị làm bếp']
  },
  {
    id: 'fd_2',
    word: 'Ingredient',
    meaning: 'Nguyên liệu',
    pronunciation: '/ɪnˈɡriː.di.ənt/',
    example: 'Fresh tomatoes are a key ___ in pizza sauce.',
    topicId: 'food',
    level: 'B1',
    wrongOptions: ['Bữa ăn chính', 'Kỹ thuật đầu bếp', 'Dụng cụ ăn uống']
  },
  {
    id: 'fd_3',
    word: 'Nutrition',
    meaning: 'Dinh dưỡng',
    pronunciation: '/njuːˈtrɪʃ.ən/',
    example: 'Eating vegetables provides essential ___.',
    topicId: 'food',
    level: 'B1',
    wrongOptions: ['Độ cay nồng', 'Mùi vị độc hại', 'Màu sắc nhân tạo']
  },
  {
    id: 'fd_4',
    word: 'Delicious',
    meaning: 'Thơm ngon, ngon miệng',
    pronunciation: '/dɪˈlɪʃ.əs/',
    example: 'This traditional chocolate cake tastes ___.',
    topicId: 'food',
    level: 'A1',
    wrongOptions: ['Đắng chát, khó nuốt', 'Thiu thối, mốc meo', 'Mặn chát']
  },
  {
    id: 'fd_5',
    word: 'Beverage',
    meaning: 'Đồ uống, thức uống',
    pronunciation: '/ˈbev.ər.ɪdʒ/',
    example: 'Fresh fruit juice is a refreshing summer ___.',
    topicId: 'food',
    level: 'B1',
    wrongOptions: ['Món ăn tráng miệng', 'Gia vị tẩm ướp', 'Thịt nướng']
  },
  {
    id: 'fd_6',
    word: 'Appetizer',
    meaning: 'Món khai vị',
    pronunciation: '/ˈæp.ə.taɪ.zər/',
    example: 'We ordered spring rolls as our ___.',
    topicId: 'food',
    level: 'B1',
    wrongOptions: ['Món ăn chính', 'Món tráng miệng', 'Đồ uống có cồn']
  },
  {
    id: 'fd_7',
    word: 'Cuisine',
    meaning: 'Nền ẩm thực',
    pronunciation: '/kwɪˈziːn/',
    example: 'Vietnamese ___ is famous for its fresh herbs.',
    topicId: 'food',
    level: 'B2',
    wrongOptions: ['Giá cả món ăn', 'Quy trình rửa bát', 'Khuôn viên nhà hàng']
  },
  {
    id: 'fd_8',
    word: 'Vegetarian',
    meaning: 'Người ăn chay / Thuộc đồ ăn chay',
    pronunciation: '/ˌvedʒ.ɪˈteə.ri.ən/',
    example: 'This restaurant offers many ___ dishes.',
    topicId: 'food',
    level: 'A2',
    wrongOptions: ['Món ăn cay nồng', 'Người thích ăn thịt', 'Đồ ăn nhanh']
  },
  {
    id: 'fd_9',
    word: 'Flavor',
    meaning: 'Hương vị',
    pronunciation: '/ˈfleɪ.vər/',
    example: 'Herbs add a rich ___ to the stew.',
    topicId: 'food',
    level: 'A2',
    wrongOptions: ['Khối lượng bữa ăn', 'Nhiệt độ phòng', 'Thời hạn sử dụng']
  },
  {
    id: 'fd_10',
    word: 'Reservation',
    meaning: 'Sự đặt bàn / đặt chỗ trước',
    pronunciation: '/ˌrez.əˈveɪ.ʃən/',
    example: 'I made a dinner ___ for 7 PM.',
    topicId: 'food',
    level: 'A2',
    wrongOptions: ['Hóa đơn tính tiền', 'Lời phàn nàn', 'Dịch vụ giao hàng']
  },

  // 6. Technology (10 words)
  {
    id: 'tc_1',
    word: 'Application',
    meaning: 'Ứng dụng (phần mềm)',
    pronunciation: '/ˌæp.lɪˈkeɪ.ʃən/',
    example: 'You can download this free ___ on mobile.',
    topicId: 'tech',
    level: 'A2',
    wrongOptions: ['Thiết bị phần cứng', 'Dây cáp sạc', 'Màn hình máy tính']
  },
  {
    id: 'tc_2',
    word: 'Database',
    meaning: 'Cơ sở dữ liệu',
    pronunciation: '/ˈdeɪ.tə.beɪs/',
    example: 'User accounts are stored securely in a central ___.',
    topicId: 'tech',
    level: 'B1',
    wrongOptions: ['Bàn phím cơ', 'Thiết bị phát Wi-Fi', 'Thẻ nhớ máy ảnh']
  },
  {
    id: 'tc_3',
    word: 'Security',
    meaning: 'An ninh, bảo mật',
    pronunciation: '/sɪˈkjʊə.rə.ti/',
    example: 'Use strong passwords to protect your online ___.',
    topicId: 'tech',
    level: 'A2',
    wrongOptions: ['Tốc độ mạng', 'Dung lượng lưu trữ', 'Kích thước màn hình']
  },
  {
    id: 'tc_4',
    word: 'Algorithm',
    meaning: 'Thuật toán',
    pronunciation: '/ˈæl.ɡə.rɪ.ðəm/',
    example: 'Social media uses an ___ to recommend videos.',
    topicId: 'tech',
    level: 'B2',
    wrongOptions: ['Thiết bị đồ họa', 'Nút bấm vật lý', 'Màu sắc giao diện']
  },
  {
    id: 'tc_5',
    word: 'Device',
    meaning: 'Thiết bị công nghệ',
    pronunciation: '/dɪˈvaɪs/',
    example: 'Connect your smart ___ to the home Wi-Fi.',
    topicId: 'tech',
    level: 'A2',
    wrongOptions: ['Tài khoản cá nhân', 'Mật khẩu bảo vệ', 'Thư điện tử']
  },
  {
    id: 'tc_6',
    word: 'Interface',
    meaning: 'Giao diện người dùng',
    pronunciation: '/ˈɪn.tə.feɪs/',
    example: 'The app features a clean and modern user ___.',
    topicId: 'tech',
    level: 'B1',
    wrongOptions: ['Bộ vi xử lý', 'Bộ lưu điện khẩn cấp', 'Nhà mạng viễn thông']
  },
  {
    id: 'tc_7',
    word: 'Update',
    meaning: 'Cập nhật',
    pronunciation: '/ʌpˈdeɪt/',
    example: 'Install the latest software ___ for bug fixes.',
    topicId: 'tech',
    level: 'A1',
    wrongOptions: ['Xóa bỏ tài khoản', 'Khởi động lại nguồn', 'Tắt kết nối mạng']
  },
  {
    id: 'tc_8',
    word: 'Network',
    meaning: 'Mạng lưới, hệ mạng',
    pronunciation: '/ˈnet.wɜːk/',
    example: 'Check your 5G wireless ___ connection.',
    topicId: 'tech',
    level: 'A2',
    wrongOptions: ['Pin sạc dự phòng', 'Bộ đếm thời gian', 'Tệp âm thanh']
  },
  {
    id: 'tc_9',
    word: 'Cloud',
    meaning: 'Điện toán đám mây / Lưu trữ mạng',
    pronunciation: '/klaʊd/',
    example: 'Back up your photos directly to the ___.',
    topicId: 'tech',
    level: 'A2',
    wrongOptions: ['Thẻ cào điện thoại', 'Cổng cắm USB', 'Sách hướng dẫn']
  },
  {
    id: 'tc_10',
    word: 'Artificial',
    meaning: 'Nhân tạo (như AI)',
    pronunciation: '/ˌɑː.tɪˈfɪʃ.əl/',
    example: 'This app uses ___ intelligence to personalize learning.',
    topicId: 'tech',
    level: 'B2',
    wrongOptions: ['Tự nhiên, hoang dã', 'Cổ điển, truyền thống', 'Thủ công mỹ nghệ']
  },

  // 7. Health (10 words)
  {
    id: 'ht_1',
    word: 'Symptom',
    meaning: 'Triệu chứng bệnh',
    pronunciation: '/ˈsɪmp.təm/',
    example: 'Fever is a common ___ of the flu.',
    topicId: 'health',
    level: 'B1',
    wrongOptions: ['Phương thuốc chữa trị', 'Bác sĩ chuyên khoa', 'Bảo hiểm y tế']
  },
  {
    id: 'ht_2',
    word: 'Prescription',
    meaning: 'Đơn thuốc',
    pronunciation: '/prɪˈskrɪp.ʃən/',
    example: 'The doctor wrote a ___ for antibiotics.',
    topicId: 'health',
    level: 'B2',
    wrongOptions: ['Hóa đơn viện phí', 'Giấy ra viện', 'Lịch hẹn phẫu thuật']
  },
  {
    id: 'ht_3',
    word: 'Patient',
    meaning: 'Bệnh nhân',
    pronunciation: '/ˈpeɪ.ʃənt/',
    example: 'The nurse monitored the ___ closely.',
    topicId: 'health',
    level: 'A2',
    wrongOptions: ['Giám đốc bệnh viện', 'Dược sĩ bán thuốc', 'Thiết bị y tế']
  },
  {
    id: 'ht_4',
    word: 'Diet',
    meaning: 'Chế độ ăn uống',
    pronunciation: '/ˈdaɪ.ət/',
    example: 'A balanced ___ includes fruits and protein.',
    topicId: 'health',
    level: 'A2',
    wrongOptions: ['Lịch tập thể hình', 'Chế độ ngủ nghỉ', 'Đơn thuốc tây']
  },
  {
    id: 'ht_5',
    word: 'Infection',
    meaning: 'Sự nhiễm trùng, nhiễm khuẩn',
    pronunciation: '/ɪnˈfek.ʃən/',
    example: 'Clean the wound carefully to prevent ___.',
    topicId: 'health',
    level: 'B2',
    wrongOptions: ['Sự hồi phục sức khỏe', 'Sự vắc-xin phòng ngừa', 'Sự thư giãn cơ bắp']
  },
  {
    id: 'ht_6',
    word: 'Treatment',
    meaning: 'Phương pháp điều trị',
    pronunciation: '/ˈtriːt.mənt/',
    example: 'Early ___ can cure many mild illnesses.',
    topicId: 'health',
    level: 'B1',
    wrongOptions: ['Nguyên nhân gây bệnh', 'Lời chẩn đoán sai', 'Chi phí khám bệnh']
  },
  {
    id: 'ht_7',
    word: 'Exercise',
    meaning: 'Tập luyện thể dục',
    pronunciation: '/ˈek.sə.saɪz/',
    example: 'Regular ___ keeps your heart healthy.',
    topicId: 'health',
    level: 'A1',
    wrongOptions: ['Nghỉ ngơi tĩnh dưỡng', 'Uống thuốc kháng sinh', 'Nằm viện điều trị']
  },
  {
    id: 'ht_8',
    word: 'Vaccine',
    meaning: 'Vắc-xin tiêm phòng',
    pronunciation: '/ˈvæk.siːn/',
    example: 'Getting a flu ___ helps protect you in winter.',
    topicId: 'health',
    level: 'B1',
    wrongOptions: ['Thuốc giảm đau', 'Thuốc ngậm ho', 'Băng gạc cá nhân']
  },
  {
    id: 'ht_9',
    word: 'Mental',
    meaning: 'Thuộc về tinh thần, tâm lý',
    pronunciation: '/ˈmen.təl/',
    example: 'Meditation supports good ___ health.',
    topicId: 'health',
    level: 'B1',
    wrongOptions: ['Thuộc về thể chất', 'Thuộc về cơ bắp', 'Thuộc về xương khớp']
  },
  {
    id: 'ht_10',
    word: 'Hygiene',
    meaning: 'Vệ sinh cá nhân/môi trường',
    pronunciation: '/ˈhaɪ.dʒiːn/',
    example: 'Good personal ___ prevents the spread of germs.',
    topicId: 'health',
    level: 'B2',
    wrongOptions: ['Thói quen ăn tiệc', 'Chế độ ăn kiêng', 'Sự tập luyện nặng']
  },

  // 8. Business English (10 words)
  {
    id: 'bs_1',
    word: 'Contract',
    meaning: 'Hợp đồng kinh doanh',
    pronunciation: '/ˈkɒn.trækt/',
    example: 'Both partners signed the legal ___ yesterday.',
    topicId: 'business',
    level: 'B1',
    wrongOptions: ['Lịch họp nội bộ', 'Báo cáo doanh thu', 'Thư mời tham dự']
  },
  {
    id: 'bs_2',
    word: 'Negotiate',
    meaning: 'Đàm phán, thương lượng',
    pronunciation: '/nəˈɡəʊ.ʃi.eɪt/',
    example: 'We are trying to ___ a better price.',
    topicId: 'business',
    level: 'B2',
    wrongOptions: ['Hủy bỏ thỏa thuận', 'Nộp thuế doanh nghiệp', 'Tăng lương nhân viên']
  },
  {
    id: 'bs_3',
    word: 'Revenue',
    meaning: 'Doanh thu',
    pronunciation: '/ˈrev.ən.juː/',
    example: 'Annual company ___ grew by fifteen percent.',
    topicId: 'business',
    level: 'B2',
    wrongOptions: ['Chi phí phát sinh', 'Khoản lỗ kinh doanh', 'Lương cố định']
  },
  {
    id: 'bs_4',
    word: 'Investment',
    meaning: 'Khoản đầu tư',
    pronunciation: '/ɪnˈvest.mənt/',
    example: 'Buying technology stocks is a long-term ___.',
    topicId: 'business',
    level: 'B1',
    wrongOptions: ['Khoản nợ phải trả', 'Tiền bảo hiểm', 'Lương hưu hàng tháng']
  },
  {
    id: 'bs_5',
    word: 'Strategy',
    meaning: 'Chiến lược kinh doanh',
    pronunciation: '/ˈstræt.ə.dʒi/',
    example: 'The board developed a new marketing ___.',
    topicId: 'business',
    level: 'B1',
    wrongOptions: ['Sản phẩm tồn kho', 'Bản thống kê giờ làm', 'Hóa đơn tiền điện']
  },
  {
    id: 'bs_6',
    word: 'Profit',
    meaning: 'Lợi nhuận',
    pronunciation: '/ˈprɒf.ɪt/',
    example: 'Higher sales led to a record quarterly ___.',
    topicId: 'business',
    level: 'A2',
    wrongOptions: ['Thất thoát tài sản', 'Chi phí quảng cáo', 'Sự vỡ nợ']
  },
  {
    id: 'bs_7',
    word: 'Market',
    meaning: 'Thị trường',
    pronunciation: '/ˈmɑː.kɪt/',
    example: 'Our products target the Asian consumer ___.',
    topicId: 'business',
    level: 'A1',
    wrongOptions: ['Phòng nhân sự', 'Kho chứa hàng', 'Xe vận chuyển']
  },
  {
    id: 'bs_8',
    word: 'Client',
    meaning: 'Khách hàng (đối tác / doanh nghiệp)',
    pronunciation: '/ˈklaɪ.ənt/',
    example: 'We met with a new corporate ___ today.',
    topicId: 'business',
    level: 'A2',
    wrongOptions: ['Chủ sở hữu cổ phần', 'Thực tập sinh', 'Cơ quan nhà nước']
  },
  {
    id: 'bs_9',
    word: 'Merger',
    meaning: 'Sự sáp nhập doanh nghiệp',
    pronunciation: '/ˈmɜː.dʒər/',
    example: 'The corporate ___ created the largest bank.',
    topicId: 'business',
    level: 'B2',
    wrongOptions: ['Sự giải thể công ty', 'Sự sa thải hàng loạt', 'Buổi khánh thành']
  },
  {
    id: 'bs_10',
    word: 'Budget',
    meaning: 'Ngân sách',
    pronunciation: '/ˈbʌdʒ.ɪt/',
    example: 'We must keep our project expenses within ___.',
    topicId: 'business',
    level: 'B1',
    wrongOptions: ['Mã số thuế', 'Hóa đơn GTGT', 'Bằng sáng chế']
  }
];
