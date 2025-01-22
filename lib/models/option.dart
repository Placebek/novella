class Option {
  String? short_story;
  String? first;
  String? second;
  String? third;

  Option({this.first, this.second, this.third, this.short_story});

  /// Factory для создания объекта из JSON
  factory Option.fromJson(Map<String, dynamic> json) {
    return Option(
      short_story: json['short_story'],
      first: json['first'],
      second: json['second'],
      third: json['third'],
    );
  }

  /// Конвертация объекта в JSON
  Map<String, dynamic> toJson() {
    return {
      'short_story': short_story,
      'first': first,
      'second': second,
      'third': third,
    };
  }
}

class OptionsResponse {
  List<Map<String, String>> options;

  OptionsResponse({required this.options});

  /// Factory для создания объекта из JSON
  factory OptionsResponse.fromJson(Map<String, dynamic> json) {
    return OptionsResponse(
      options: List<Map<String, String>>.from(
        json['options'].map((option) => Map<String, String>.from(option)),
      ),
    );
  }

  /// Конвертация объекта в JSON
  Map<String, dynamic> toJson() {
    return {
      'options':
          options.map((option) => Map<String, String>.from(option)).toList(),
    };
  }
}
