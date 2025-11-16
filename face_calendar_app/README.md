Face Calendar - Flutter Hybrid App (WebView)
============================================

개요
----
기존 Next.js 랜딩(https://face-calendar-landing.vercel.app)을 WebView로 감싼 Flutter 하이브리드 앱입니다. Android/iOS 동시 출시를 목표로 하며, 후속으로 Flutter Web 빌드를 Vercel에 배포하는 절차도 안내합니다.

사전 준비
--------
- Flutter 3.22+ / Dart 최신
- Android Studio, Xcode (각 플랫폼 빌드 도구)
- 애플 개발자 계정, 구글 플레이 콘솔 계정(스토어 출시 시)

의존성 설치
----------
```bash
cd face_calendar_app
flutter pub get
```

스플래시/아이콘
--------------
- 스플래시(색상 기반, 이미지 없이 동작):
```bash
dart run flutter_native_splash:create
```
- 런처 아이콘(이미지 필요):
  - `assets/icon.png` 추가 후 아래 실행
```bash
dart run flutter_launcher_icons
```

실행
----
Android:
```bash
flutter run -d android
```
iOS:
```bash
flutter run -d ios
```

프로덕션 빌드
------------
Android App Bundle:
```bash
flutter build appbundle --release
```
iOS(IPA):
```bash
flutter build ipa --release
```

Flutter Web 빌드 및 Vercel 배포(선택)
-----------------------------------
Flutter Web로도 배포할 수 있습니다(정적 호스팅).
1) 웹 활성화 및 빌드
```bash
flutter config --enable-web
flutter build web --release
```
2) Vercel CLI 설치
```bash
npm i -g vercel
```
3) 새 프로젝트 이름 지정 배포(정적 디렉토리 업로드)
```bash
cd build/web
vercel --name face-calendar-app --prod --confirm
```
   - 처음 1회는 `vercel login` 또는 `vercel link`가 필요할 수 있습니다.
   - 이 방식은 빌드 산출물(정적 파일)을 직접 업로드하므로 Vercel 빌드 환경에 Flutter가 없어도 됩니다.

기타 설정
--------
- `lib/main.dart`의 `startUrl`을 실제 프로덕션 도메인으로 유지/교체하세요.
- WebView 권한(카메라 등)은 앱 최초 실행 시 플랫폼별 권한 팝업에서 허용해야 합니다.
- 외부 링크(`tel:`, `mailto:` 등)는 기기 외부 앱으로 열리도록 처리되어 있습니다.


