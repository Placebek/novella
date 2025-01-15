import 'dart:io';
import 'package:flutter_sound/flutter_sound.dart';
import 'package:permission_handler/permission_handler.dart';

class AudioService {
  static FlutterSoundRecorder? _recorder;
  static bool _isRecording = false;

  /// Инициализация сервиса записи
  static Future<void> initialize() async {
    _recorder = FlutterSoundRecorder();

    // Запрашиваем разрешение на использование микрофона
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
          '${Directory.systemTemp.path}/recording_${DateTime.now().millisecondsSinceEpoch}.aac'; // Генерируем уникальный путь
      await _recorder!.startRecorder(toFile: path);
      _isRecording = true;
      print('Запись начата, файл сохраняется в $path');
    } catch (e) {
      throw Exception('Ошибка при начале записи: $e');
    }
  }

  /// Остановить запись
  static Future<String> stopRecording() async {
    if (!_isRecording) {
      throw Exception('Запись не активна');
    }

    try {
      final path = await _recorder!.stopRecorder();
      _isRecording = false;
      if (path != null) {
        print('Запись завершена, файл сохранён в $path');
        return path; // Возвращаем путь к записанному файлу
      } else {
        throw Exception('Не удалось получить путь к файлу');
      }
    } catch (e) {
      throw Exception('Ошибка при остановке записи: $e');
    }
  }

  /// Освобождение ресурсов
  static Future<void> dispose() async {
    await _recorder!.closeRecorder();
    _recorder = null;
  }

  /// Отправка записи на сервер
  static Future<void> uploadRecording(String filePath) async {
    try {
      final file = File(filePath);
      if (!file.existsSync()) {
        throw Exception('Файл не найден');
      }

      // Симуляция загрузки файла
      print('Загрузка файла $filePath на сервер...');
      await Future.delayed(Duration(seconds: 2)); // Имитируем задержку загрузки
      print('Файл успешно загружен на сервер');
    } catch (e) {
      throw Exception('Ошибка при загрузке файла: $e');
    }
  }
}
