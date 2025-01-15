import 'dart:io';
import 'package:flutter_sound/flutter_sound.dart';
import 'package:permission_handler/permission_handler.dart';

class AudioService {
  static FlutterSoundRecorder? _recorder;
  static bool _isRecording = false;

  /// Инициализация сервиса записи
  static Future<void> initialize() async {
    _recorder = FlutterSoundRecorder();

    // Запрашиваем разрешения на запись
    final status = await Permission.microphone.request();
    if (!status.isGranted) {
      throw Exception('Нет разрешения на использование микрофона');
    }

    await _recorder!.openRecorder();
  }

  /// Начать запись
  static Future<void> startRecording() async {
    if (_isRecording) {
      throw Exception('Запись уже начата');
    }

    try {
      final path =
          '${Directory.systemTemp.path}/recording.aac'; // Временный путь
      await _recorder!.startRecorder(toFile: path);
      _isRecording = true;
      print('Запись начата, файл сохраняется в $path');
    } catch (e) {
      throw Exception('Ошибка при начале записи: $e');
    }
  }

  /// Остановить запись
  static Future<void> stopRecording() async {
    if (!_isRecording) {
      throw Exception('Запись не активна');
    }

    try {
      final path = await _recorder!.stopRecorder();
      _isRecording = false;
      print('Запись завершена, файл сохранён в $path');
    } catch (e) {
      throw Exception('Ошибка при остановке записи: $e');
    }
  }

  /// Освобождение ресурсов
  static Future<void> dispose() async {
    await _recorder!.closeRecorder();
    _recorder = null;
  }
}
