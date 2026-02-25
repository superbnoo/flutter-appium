### iOS
+ Build:
```
flutter build ios --simulator --debug --target lib/main_test.dart # instead of default lib/main.dart
```
> ✓ Built build/ios/iphonesimulator/Runner.app

+ Run test:
```
cd e2e_test && npm run wdio:ios # prerequiste: appium server has started
```

+ Start appium server
```
npm appium --address 0.0.0.0 --port 4723
```

### Android
+ Build:
```
flutter build apk --debug --target lib/main_test.dart
```
> ✓ Built build/app/outputs/flutter-apk/app-debug.apk

+ Run test:
```
cd e2e_test && npm run wdio:android # prerequiste: appium server has started
```

### wdio conf.ts creation
```
npx wdio config
```

### Package creation
```
npm init -y
npm i -D @wdio/cli
npm i -D appium-flutter-finder appium-flutter-driver
npm i -D appium
```
