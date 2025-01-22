import 'package:novella_ai/repositories/option_repository.dart';

class OptionsController {
  final OptionsRepository repository;

  OptionsController(this.repository);

  /// Получение списка опций
  Future<List<Map<String, String>>> fetchOptions() async {
    try {
      return (await repository.getOptions()).cast<Map<String, String>>();
    } catch (e) {
      throw Exception('Ошибка получения опций: $e');
    }
  }

  /// Отправка выбранного варианта и получение обновленных опций
  Future<List<Map<String, dynamic>>> sendVariant(
      String variant, int requestId, String token) async {
    try {
      return await repository.sendVariant(variant, requestId, token);
    } catch (e) {
      throw Exception('Ошибка отправки варианта: $e');
    }
  }
}
