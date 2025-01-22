import 'dart:convert';
import 'package:http/http.dart' as http;

class OptionsApi {
  final String baseUrl = 'http://192.168.96.31:8080'; // Базовый URL

  /// Получение списка опций
  Future<List<Map<String, dynamic>>> fetchOptions() async {
    final response = await http.get(Uri.parse('$baseUrl/options'));

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return List<Map<String, dynamic>>.from(data['options']);
    } else {
      throw Exception('Ошибка загрузки данных: ${response.statusCode}');
    }
  }

  /// Отправка варианта на сервер
  Future<List<Map<String, dynamic>>> sendVariant(
      String variant, int requestId, String token) async {
    final String endpoint = "$baseUrl/api/user_to_gpts/create/usertogpts";

    try {
      final response = await http.post(
        Uri.parse(endpoint),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          "variant": variant,
          "request_id": requestId,
        }),
      );
      print('Ответ сервера: ${response}');
      final responseData = jsonDecode(response.body);
      return responseData['options'] != null
          ? List<Map<String, dynamic>>.from(responseData['options'])
          : [];
    } catch (e) {
      throw Exception("Ошибка отправки варианта: $e");
    }
  }
}
