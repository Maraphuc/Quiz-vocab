# Flutter apps normally need little custom shrinking configuration.
# Keep Flutter TTS plugin classes safe from aggressive obfuscation.
-keep class com.tundralabs.fluttertts.** { *; }
-keep class io.flutter.plugins.** { *; }
