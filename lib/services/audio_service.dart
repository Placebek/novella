import 'dart:io';
import 'dart:convert';
import 'package:flutter_sound/flutter_sound.dart';
import 'package:http/http.dart' as http;
import 'package:permission_handler/permission_handler.dart';
import 'package:shared_preferences/shared_preferences.dart';

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
  static Future<Map<String, dynamic>> uploadRecording(String filePath) async {
    try {
      final file = File(filePath);
      if (!file.existsSync()) {
        throw Exception('Файл не найден');
      }

      // Получение токена из SharedPreferences
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) {
        throw Exception('Токен не найден');
      }

      // Создание URL и заголовков
      final uri =
          Uri.parse('http://192.168.96.31:8080/api/requests/create/requests');
      final headers = {
        'Authorization': 'Bearer $token', // Добавляем токен
        'Content-Type': 'multipart/form-data',
      };

      // Создаём multipart-запрос
      final request = http.MultipartRequest('POST', uri);
      request.headers.addAll(headers);
      request.files.add(await http.MultipartFile.fromPath('mp3', filePath));

      // Отправляем запрос
      final response = await request.send();
      final responseBody = await response.stream.bytesToString();
      final data = jsonDecode(responseBody);
      print('Ответ сервера: $data');
      return data;
    } catch (e) {
      throw Exception('Ошибка при загрузке файла: $e');
    }
  }
}
