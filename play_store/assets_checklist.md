# Play Store Asset Checklist

Checklist này dùng trước khi upload Quiz Vocab lên Google Play Console.

## Bắt buộc cho store listing

### App icon

- File: PNG 32-bit có alpha
- Kích thước: 512 x 512 px
- Dung lượng tối đa: 1024 KB
- Không bo góc thủ công, không thêm drop shadow bên ngoài
- Không thêm chữ kiểu "Top", "Best", "Free", "No.1", hoặc badge gây hiểu nhầm
- Thiết kế gợi ý: nền xanh tím thương hiệu, biểu tượng quyển sách/từ vựng, dấu tick quiz

### Feature graphic

- File: JPG hoặc PNG không alpha
- Kích thước: 1024 x 500 px
- Nội dung gợi ý: logo Quiz Vocab, câu tagline ngắn, 3 điểm nổi bật:
  - 16 chủ đề
  - 160 từ vựng
  - Quiz offline hằng ngày
- Tránh dùng quá nhiều chữ vì hình có thể bị crop trên một số bề mặt Google Play

### Phone screenshots

Tối thiểu cần 2 ảnh chụp màn hình. Khuyến nghị chuẩn bị 5 ảnh:

1. Trang chủ: hiển thị 16 chủ đề và tiến độ học
2. Chọn chủ đề: danh sách topic + level
3. Màn quiz: câu hỏi, lựa chọn, nút nghe phát âm
4. Kết quả: điểm số, phần trăm, từ sai
5. Từ sai: phiên âm, ví dụ, nghe lại, đã thuộc

Yêu cầu kỹ thuật:

- JPG hoặc PNG 24-bit, không alpha
- Kích thước mỗi cạnh từ 320 px đến 3840 px
- Cạnh dài không được lớn hơn quá 2 lần cạnh ngắn
- Nên dùng ảnh dọc 1080 x 1920 px cho điện thoại
- Nội dung phải phản ánh đúng phiên bản app hiện tại

## Metadata cần điền trong Play Console

- App name: Quiz Vocab
- Short description: dùng `play_store/listing/vi-VN/short_description.txt`
- Full description: dùng `play_store/listing/vi-VN/full_description.txt`
- Privacy Policy URL: host nội dung `PRIVACY_POLICY.md` ở URL công khai
- Support email: điền email hỗ trợ thật của nhà phát triển
- Data Safety: dùng gợi ý trong `play_store/data_safety.md`

## Trước khi publish production

- Build `.aab` bằng upload keystore thật, không dùng CI debug/temp keystore
- Test app trên ít nhất 1 máy Android thật
- Kiểm tra dark mode, phát âm, reset tiến độ, từ sai, lưu tiến độ sau khi đóng/mở app
- Tạo internal testing release trước khi production
