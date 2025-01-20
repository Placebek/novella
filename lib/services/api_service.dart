import 'dart:convert';
import 'package:http/http.dart' as http;
import 'storage_service.dart';

class ApiService {
  static const String baseUrl = 'http://192.168.96.31:8080/api';

  static Future<String?> login(String email, String password) async {
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

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data[
            'token']; // Убедитесь, что ключ 'token' соответствует вашему API
      } else {
        print('Ошибка: ${response.body}');
        return null;
      }
    } catch (e) {
      print('Ошибка подключения: $e');
      return null;
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
