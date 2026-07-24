# Google Play Data Safety - Gợi ý khai báo

Tài liệu này giúp điền biểu mẫu Data Safety trên Google Play Console cho phiên bản hiện tại của Quiz Vocab.

## Tóm tắt

- Ứng dụng có thu thập hoặc chia sẻ dữ liệu người dùng không? Không.
- Ứng dụng có mã hóa dữ liệu khi truyền không? Không áp dụng vì không truyền dữ liệu người dùng lên máy chủ.
- Người dùng có thể yêu cầu xóa dữ liệu không? Có, bằng chức năng Reset tiến độ trong app hoặc gỡ ứng dụng.
- Ứng dụng có quảng cáo không? Không.
- Ứng dụng có mua hàng trong app không? Không.
- Ứng dụng có đăng nhập/tài khoản không? Không.

## Dữ liệu lưu cục bộ

Quiz Vocab lưu cục bộ trên thiết bị:

- Điểm quiz
- Số câu đúng
- Streak học tập
- Danh sách từ sai
- Cài đặt âm thanh/giao diện

Các dữ liệu này không rời khỏi thiết bị và không được chia sẻ với bên thứ ba.

## Quyền nhạy cảm

Phiên bản hiện tại không yêu cầu quyền vị trí, camera, microphone, danh bạ, SMS, điện thoại hoặc bộ nhớ ngoài.

## Lưu ý trước khi phát hành

Nếu sau này thêm quảng cáo, Firebase Analytics, Crashlytics, đăng nhập, lưu cloud hoặc mua hàng trong app, bạn phải cập nhật lại biểu mẫu Data Safety và Privacy Policy.