# Not a real model

`train_jasmine_wakeword.py` builds its training audio from computer-made sine waves and writes its own
byte layout with an `.onnx` name. ONNX Runtime cannot load it, it never heard a human say "Jasmine",
and the accuracy numbers in `jasmine_wakeword.json` are text, not measurements.

The app does **not** use it. "Hey Jasmine" now runs from `WakeWordService.kt` with the open-source
Vosk speech model. If you later want a custom model, train it with real recorded voices
(openWakeWord) and load it through ONNX Runtime.
