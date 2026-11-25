# Jasmine

© 2026 Yakraj. All rights reserved.

Jasmine is a native Android voice assistant (Kotlin, Jetpack Compose) with a Gemini brain. She talks in
Hindi, English and Hinglish, does real phone tasks by voice, and can switch between Friendly, Girlfriend,
Serious and Independent Woman modes.

## Build

1. Install JDK 17 and the Android SDK.
2. `./gradlew assembleRelease`
3. The APK is written to `app/build/outputs/apk/`.

The GitHub Actions workflow in `.github/workflows` builds the same APK on every push.

## Setup

1. Open the app and finish the setup wizard.
2. In **Settings > Personal & Keys** pick a provider, paste its key, tap verify, then pick a model.
3. Grant the permissions you want from the Permissions screen (Accessibility unlocks screen control).

## Highlights

- 700+ device tools reachable by voice (calls, SMS, contacts, apps, settings, volume, display, screen
  control, camera, alarms, calendar, system info, files, web, calculator, converters, security).
- Voice Engine: intruder selfie, app lock (fingerprint / face / screen lock), AI call screening,
  notification reader.
- Advanced Settings: auto reply, auto accept calls, smart home webhook (each has its own on/off switch).
- 470+ built-in connectors plus the live MCP registry.

See `ROADMAP.md` for what is planned next.
