import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class RequestScreen extends StatefulWidget {
  final Map<String, dynamic> request;
  final List<dynamic> initialOptions;

  RequestScreen({required this.request, required this.initialOptions});

  @override
  _RequestScreenState createState() => _RequestScreenState();
}

class _RequestScreenState extends State<RequestScreen> {
  List<Map<String, dynamic>> optionsList = [];

  @override
  void initState() {
    super.initState();
    optionsList = List<Map<String, dynamic>>.from(widget.initialOptions);
  }

  // Функция для отправки выбранного варианта на сервер
  Future<void> sendVariantToServer(String variant, int requestId) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    if (token == null) {
      throw Exception('Токен не найден');
    }
    const String apiUrl =
        "http://192.168.96.31:8080/api/user_to_gpts/create/usertogpts";

    try {
      final response = await http.post(
        Uri.parse(apiUrl),
        headers: {
          'Authorization': 'Bearer $token',
          "Content-Type": "application/json",
        },
        body: jsonEncode({
          "variant": variant,
          "request_id": requestId,
        }),
      );

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);

        if (responseData['options'] != null) {
          setState(() {
            optionsList.addAll(responseData['options']);
          });
        }
      } else {
        print("Ошибка при отправке: ${response.statusCode}");
        print("Ответ сервера: ${response.body}");
      }
    } catch (e) {
      print("Ошибка: $e");
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
        child: ListView.builder(
          itemCount: optionsList.length,
          itemBuilder: (context, index) {
            final option = optionsList[index];
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
                      sendVariantToServer(
                          option['first'], widget.request['id']);
                    },
                    child: optionButton(option['first']),
                  ),
                if (option.containsKey('second'))
                  GestureDetector(
                    onTap: () {
                      sendVariantToServer(
                          option['second'], widget.request['id']);
                    },
                    child: optionButton(option['second']),
                  ),
                if (option.containsKey('third'))
                  GestureDetector(
                    onTap: () {
                      sendVariantToServer(
                          option['third'], widget.request['id']);
                    },
                    child: optionButton(option['third']),
                  ),
                SizedBox(height: 16),
              ],
            );
          },
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
