import '../models/option.dart';

class OptionController {
  final OptionRepository _optionRepository = OptionRepository();

  Future<List<Option>> getOptions() async {
    return await _optionRepository.getOptions();
  }

  Future<Option> getOption(String id) async {
    return await _optionRepository.getOption(id);
  }

  Future<void> addOption(Option option) async {
    return await _optionRepository.addOption(option);
  }

  Future<void> updateOption(Option option) async {
    return await _optionRepository.updateOption(option);
  }

  Future<void> deleteOption(String id) async {
    return await _optionRepository.deleteOption(id);
  }
}
