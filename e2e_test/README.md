### iOS
+ Build:
flutter build ios --simulator --debug
> ✓ Built build/ios/iphonesimulator/Runner.app

+ Run test:
cd e2e_test && npm run wdio:ios

### Android
+ Build:
flutter build apk --debug
> ✓ Built build/app/outputs/flutter-apk/app-debug.apk

+ Run test:
cd e2e_test && npm run wdio:android
