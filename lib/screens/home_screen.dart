import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import '../services/audio_service.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Главная')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: () async {
                // Проверка и запрос доступа к микрофону
                var status = await Permission.microphone.request();
                if (status.isGranted) {
                  await AudioService.startRecording();
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Нет доступа к микрофону')),
                  );
                }
              },
              child: Text('Начать запись'),
            ),
            ElevatedButton(
              onPressed: () async {
                await AudioService.stopRecording();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Запись завершена')),
                );
              },
              child: Text('Остановить запись'),
            ),
          ],
        ),
      ),
    );
  }
}
