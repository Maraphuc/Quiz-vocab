# Quiz Vocab

Quiz Vocab là ứng dụng Flutter học từ vựng tiếng Anh qua câu hỏi trắc nghiệm. Dự án này đã được chuẩn bị theo hướng có thể build Android App Bundle (`.aab`) để phát hành lên Google Play.

> Lưu ý: repo vẫn giữ phần React/Vite AI Studio preview cũ. App Android chính thức nằm ở Flutter root project: `pubspec.yaml`, `lib/`, `android/`.

## Tính năng

- 16 chủ đề từ vựng: Everyday Life, School, Work, Travel, Food, Technology, Health, Business English, Shopping, Environment, Sports & Hobbies, Media & Culture, Emotions, Phrasal Verbs, Idioms, Exam Prep
- 160 từ vựng mẫu chia đều theo chủ đề
- 5 dạng câu hỏi: chọn nghĩa, chọn từ tiếng Anh, điền từ vào câu, nhận diện phiên âm, hiểu nghĩa theo ngữ cảnh
- Tối đa 20 câu mỗi lượt quiz để bài học đa dạng hơn
- Hiển thị đúng/sai và giải thích ngay sau mỗi câu
- Lưu từ sai để ôn tập riêng với phiên âm, ví dụ, phát âm và số lần sai
- Reset tiến độ có hộp xác nhận để tránh bấm nhầm
- Lưu tiến độ offline bằng SharedPreferences
- Dark mode
- Phát âm bằng Text-to-Speech trên thiết bị
- Không đăng nhập, không quảng cáo, không mua hàng trong app

## Yêu cầu môi trường

- Flutter stable mới
- Android SDK Platform 36
- Java 17+
- Android Studio hoặc command line tools

## Chạy app local

```bash
flutter pub get
flutter run
```

Nếu thư mục Android của máy bạn thiếu file wrapper sau khi clone, chạy một lần:

```bash
flutter create . --platforms=android --org com.maraphuc
flutter pub get
```

Sau đó kiểm tra lại các file cấu hình trong `android/app/build.gradle` vẫn giữ:

- `applicationId "com.maraphuc.quizvocab"`
- `compileSdk 36`
- `targetSdk 36`

## Build Android App Bundle cho Google Play

### 1. Tạo upload keystore

```bash
keytool -genkey -v -keystore android/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

### 2. Tạo file `android/key.properties`

Copy file mẫu:

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

### 3. Build release AAB

```bash
flutter clean
flutter pub get
flutter build appbundle --release
```

File upload sẽ nằm ở:

```text
build/app/outputs/bundle/release/app-release.aab
```

## Trước khi upload Google Play

Kiểm tra các mục sau:

- Đổi package name nếu muốn dùng thương hiệu riêng lâu dài
- Cập nhật `version` trong `pubspec.yaml`, ví dụ `1.1.0+2`
- Build bằng keystore thật
- Tạo Privacy Policy URL công khai từ nội dung `PRIVACY_POLICY.md`
- Điền Data Safety theo `play_store/data_safety.md`
- Chuẩn bị icon 512x512, feature graphic 1024x500 và ảnh chụp màn hình điện thoại theo `play_store/assets_checklist.md`
- Kiểm thử trên ít nhất một thiết bị Android thật
- Tạo internal testing release trước khi mở production

## Nội dung Play Store

- Mô tả ngắn: `play_store/listing/vi-VN/short_description.txt`
- Mô tả đầy đủ: `play_store/listing/vi-VN/full_description.txt`
- Gợi ý Data Safety: `play_store/data_safety.md`
- Checklist asset: `play_store/assets_checklist.md`
- Privacy Policy: `PRIVACY_POLICY.md`

## Quyền riêng tư

Phiên bản hiện tại không thu thập dữ liệu cá nhân. Dữ liệu học tập chỉ được lưu local trên thiết bị.
