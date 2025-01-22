import 'dart:convert';
import 'package:http/http.dart' as http;
import 'storage_service.dart';

class ApiService {
  static const String baseUrl = 'http://192.168.96.31:8080/api';

  static Future<bool> login(String email, String password) async {
    final url = Uri.parse('$baseUrl/users/login');
    try {
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'email': email,
          'password': password,
        }),
      );

      // Парсим ответ
      final data = json.decode(response.body);

      // Проверяем наличие ключей
      if (data.containsKey('token') && data.containsKey('user')) {
        final token = data['token'];
        final userId = data['user']['id'];

        // Сохраняем токен и user ID
        await StorageService.saveToken(token);
        await StorageService.saveUserId(userId);

        print('Токен и user_id успешно сохранены.');
        return true;
      } else {
        print('Ошибка: Токен или user данные отсутствуют.');
        return false;
      }
    } catch (e) {
      print('Ошибка подключения: $e');
      return false;
    }
  }

  // Пример функции для получения данных
  static Future<dynamic> fetchData(String endpoint) async {
    final url = Uri.parse('$baseUrl/$endpoint');
    try {
      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer ${await StorageService.getToken()}',
        },
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        print('Ошибка: ${response.body}');
        return null;
      }
    } catch (e) {
      print('Ошибка подключения: $e');
      return null;
    }
  }
}
