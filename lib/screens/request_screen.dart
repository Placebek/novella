import 'package:flutter/material.dart';
import 'package:novella_ai/services/option_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

class RequestScreen extends StatefulWidget {
  final Map<String, dynamic> request;
  final List<dynamic> initialOptions;

  RequestScreen({required this.request, required this.initialOptions});

  @override
  _RequestScreenState createState() => _RequestScreenState();
}

class _RequestScreenState extends State<RequestScreen> {
  final OptionsApi api = OptionsApi();
  List<Map<String, dynamic>> optionsList = [];
  List<Map<String, dynamic>> permanentList = [];
  bool isLoading = false;

  @override
  void initState() {
    super.initState();
    // Загружаем начальные опции
    optionsList = List<Map<String, dynamic>>.from(widget.initialOptions);
  }

  Future<void> sendVariant(
      String variant, int requestId, String? shortStory) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    if (token == null) {
      print('Токен не найден');
      return;
    }
    print('Отправка варианта: $shortStory - $variant');
    setState(() {
      isLoading = true;
    });

    try {
      final updatedOptions = await api.sendVariant(variant, requestId, token);
      setState(() {
        // Добавляем выбранный вариант вместе с short_story в постоянный список
        permanentList.add({'short_story': shortStory, 'variant': variant});
        // Обновляем список новых вариантов
        optionsList = updatedOptions;
      });
    } catch (e) {
      print('Ошибка отправки варианта: $e');
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Детали запроса'),
        backgroundColor: Color.fromRGBO(87, 142, 126, 1),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Expanded(
              child: ListView.builder(
                itemCount: permanentList.length +
                    optionsList.length +
                    (isLoading ? 1 : 0),
                itemBuilder: (context, index) {
                  if (index < permanentList.length) {
                    // Отображаем сохраненные пары short_story и variant
                    final permanentOption = permanentList[index];
                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (permanentOption['short_story'] != null)
                          Padding(
                            padding: const EdgeInsets.only(bottom: 8.0),
                            child: Text(
                              'История: ${permanentOption['short_story']}',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        optionButton(permanentOption['variant']),
                        SizedBox(height: 16),
                      ],
                    );
                  } else if (index <
                      permanentList.length + optionsList.length) {
                    final option = optionsList[index - permanentList.length];
                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (option.containsKey('short_story'))
                          Padding(
                            padding: const EdgeInsets.only(bottom: 8.0),
                            child: Text(
                              'История: ${option['short_story']}',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        if (option.containsKey('first'))
                          GestureDetector(
                            onTap: () {
                              sendVariant(
                                option['first'],
                                widget.request['id'],
                                option.containsKey('short_story')
                                    ? option['short_story']
                                    : null,
                              );
                            },
                            child: optionButton(option['first']),
                          ),
                        if (option.containsKey('second'))
                          GestureDetector(
                            onTap: () {
                              sendVariant(
                                option['second'],
                                widget.request['id'],
                                option.containsKey('short_story')
                                    ? option['short_story']
                                    : null,
                              );
                            },
                            child: optionButton(option['second']),
                          ),
                        if (option.containsKey('third'))
                          GestureDetector(
                            onTap: () {
                              sendVariant(
                                option['third'],
                                widget.request['id'],
                                option.containsKey('short_story')
                                    ? option['short_story']
                                    : null,
                              );
                            },
                            child: optionButton(option['third']),
                          ),
                        SizedBox(height: 16),
                      ],
                    );
                  } else {
                    return Center(
                      child: Padding(
                        padding: const EdgeInsets.only(top: 16.0),
                        child: CircularProgressIndicator(),
                      ),
                    );
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget optionButton(String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Container(
        padding: EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.grey[200],
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: Colors.grey),
        ),
        child: Text(
          '- $text',
          style: TextStyle(fontSize: 16),
        ),
      ),
    );
  }
}
