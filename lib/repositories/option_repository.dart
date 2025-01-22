import 'package:novella_ai/services/option_service.dart';

class OptionsRepository {
  final OptionsApi api;

  OptionsRepository(this.api);

  /// Получение опций из API
  Future<List<Map<String, dynamic>>> getOptions() async {
    return await api.fetchOptions();
  }

  /// Отправка варианта и получение обновленного списка опций
  Future<List<Map<String, dynamic>>> sendVariant(
      String variant, int requestId, String token) async {
    return await api.sendVariant(variant, requestId, token);
  }
}
