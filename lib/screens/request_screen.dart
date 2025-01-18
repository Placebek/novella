import 'package:flutter/material.dart';

class RequestScreen extends StatelessWidget {
  final List<Map<String, String>> options;

  RequestScreen({required this.options});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Ответы от сервера'),
        backgroundColor: Color.fromRGBO(87, 142, 126, 1),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView.builder(
          itemCount: options.length,
          itemBuilder: (context, index) {
            final option = options[index];
            return Card(
              elevation: 2,
              margin: EdgeInsets.only(bottom: 16),
              child: ListTile(
                title: Text(option.values.first),
              ),
            );
          },
        ),
      ),
    );
  }
}
