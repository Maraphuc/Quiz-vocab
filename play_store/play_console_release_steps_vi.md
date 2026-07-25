# Hướng dẫn phát hành Quiz Vocab lên Google Play

Tài liệu này dùng sau khi PR release đã được merge vào `main` và GitHub Actions build thành công.

## 1. Chuẩn bị keystore thật

Chạy trên máy cá nhân, không chạy trên CI:

```bash
keytool -genkey -v -keystore android/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

Tạo file `android/key.properties` từ file mẫu:

```bash
cp android/key.properties.example android/key.properties
```

Điền thông tin thật:

```properties
storePassword=YOUR_STORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=upload
storeFile=../upload-keystore.jks
```

Không commit `android/key.properties` hoặc file `.jks`.

## 2. Build AAB release

```bash
flutter clean
flutter pub get
flutter build appbundle --release
```

File để upload lên Google Play:

```text
build/app/outputs/bundle/release/app-release.aab
```

## 3. Tạo app trong Play Console

Trong Google Play Console:

1. Chọn **Create app**.
2. App name: `Quiz Vocab`.
3. Default language: `Vietnamese (Vietnam)` hoặc ngôn ngữ bạn muốn phát hành chính.
4. App or game: **App**.
5. Free or paid: **Free**.
6. Xác nhận Developer Program Policies và US export laws.

## 4. Điền Store listing

Dùng các file đã chuẩn bị:

- Short description: `play_store/listing/vi-VN/short_description.txt`
- Full description: `play_store/listing/vi-VN/full_description.txt`
- App icon: PNG 512x512
- Feature graphic: PNG/JPG 1024x500
- Phone screenshots: khuyến nghị 5 ảnh theo `play_store/screenshots_plan.md`

## 5. Privacy Policy

Host nội dung `PRIVACY_POLICY.md` thành một URL công khai.

Gợi ý đơn giản:

- GitHub Pages
- Google Sites
- Website cá nhân
- Trang chính sách riêng trên domain của bạn

Sau đó dán URL vào Play Console.

## 6. Data Safety

Dựa theo `play_store/data_safety.md`, chọn hướng khai báo:

- App không thu thập dữ liệu cá nhân.
- App không chia sẻ dữ liệu với bên thứ ba.
- Tiến độ học, từ sai, dark mode và cài đặt âm thanh chỉ lưu local trên thiết bị.
- Không quảng cáo.
- Không mua hàng trong app.
- Không đăng nhập.
- Không quyền nhạy cảm.

## 7. Content rating

Trả lời questionnaire theo hướng:

- App giáo dục/học từ vựng.
- Không bạo lực.
- Không nội dung người lớn.
- Không cờ bạc.
- Không chat/user-generated content.
- Không mua hàng trong app.

## 8. Upload bản đầu tiên

Nên upload trước vào **Internal testing**:

1. Vào **Testing > Internal testing**.
2. Tạo release mới.
3. Upload `app-release.aab`.
4. Thêm release notes, ví dụ:

```text
Phiên bản đầu tiên của Quiz Vocab: học 160 từ vựng qua 16 chủ đề, 5 dạng quiz, ôn từ sai, lưu tiến độ offline và phát âm bằng TTS.
```

5. Thêm tài khoản tester.
6. Cài thử từ link internal testing.

## 9. Test trước khi gửi review

Kiểm tra trên máy Android thật:

- Mở app lần đầu.
- Chọn chủ đề và làm quiz.
- Trả lời sai để kiểm tra mục Từ sai.
- Nghe phát âm.
- Bật/tắt dark mode.
- Reset tiến độ và kiểm tra hộp xác nhận.
- Thoát app mở lại để kiểm tra dữ liệu local vẫn lưu.

## 10. Gửi production review

Chỉ gửi production review khi:

- Internal testing ổn.
- Store listing đủ icon, feature graphic, screenshots.
- Privacy Policy URL mở được không cần đăng nhập.
- Data Safety đã khai báo nhất quán với app.
- Support email đã điền trong Play Console.
- App bundle build bằng keystore thật.
