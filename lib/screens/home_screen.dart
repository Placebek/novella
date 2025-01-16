import 'package:flutter/material.dart';
import 'dart:async';
import '../services/audio_service.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<String> unfinishedNovels = [];
  bool isRecording = false;
  double buttonSize = 60.0; // Размер кнопки по умолчанию
  Timer? _timer;
  int _recordingDuration = 0;

  @override
  void initState() {
    super.initState();
    _fetchUnfinishedNovels(); // Запрос данных с сервера
    AudioService.initialize();
  }

  @override
  void dispose() {
    AudioService.dispose();
    _timer?.cancel();
    super.dispose();
  }

  Future<void> _fetchUnfinishedNovels() async {
    // Имитируем получение данных с сервера
    await Future.delayed(Duration(seconds: 2));
    setState(() {
      unfinishedNovels = [
        "Новелла 1",
        "Новелла 2",
        "Новелла 3",
      ];
    });
  }

  void _showRecordingModal() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Color.fromRGBO(245, 236, 213, 1),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setModalState) {
            return Padding(
              padding: const EdgeInsets.all(40.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  ElevatedButton(
                    onPressed: () {
                      // Логика отмены
                      Navigator.of(context).pop();
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Color.fromRGBO(67, 67, 67, 1),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: Text("Отмена",
                        style: TextStyle(fontSize: 18, color: Colors.white)),
                  ),
                  SizedBox(height: 20),
                  GestureDetector(
                    onLongPress: () async {
                      setModalState(() {
                        isRecording = true;
                        _recordingDuration = 0;
                      });
                      print('Началась запись'); // Для проверки
                      await AudioService.startRecording();
                      _startTimer(setModalState);
                    },
                    onLongPressUp: () async {
                      setModalState(() {
                        isRecording = false;
                      });
                      print('Запись завершена'); // Для проверки
                      try {
                        final filePath = await AudioService.stopRecording();
                        print("Файл записан: $filePath");
                      } catch (e) {
                        print("Ошибка: $e");
                      }
                      _stopTimer();
                    },
                    child: Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: isRecording
                            ? Colors.red
                            : Color.fromRGBO(87, 142, 126, 1),
                      ),
                      child: Icon(
                        Icons.mic,
                        color: Colors.white,
                        size: 30,
                      ),
                    ),
                  ),
                  SizedBox(height: 20),
                  Text(
                    'Время записи: ${_recordingDuration / 1000} секунд',
                    style: TextStyle(fontSize: 18),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _startTimer(StateSetter setModalState) {
    _timer = Timer.periodic(Duration(milliseconds: 100), (timer) {
      setModalState(() {
        _recordingDuration += 100;
      });
    });
  }

  void _stopTimer() {
    _timer?.cancel();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color.fromRGBO(255, 250, 236, 1), // Задний фон
      appBar: AppBar(
        title: Text('Главная'),
        backgroundColor: Color.fromRGBO(87, 142, 126, 1), // Цвет AppBar
      ),
      drawer: Drawer(
        backgroundColor: Color.fromRGBO(245, 236, 213, 1),
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            Container(
              padding: EdgeInsets.only(left: 20, top: 50),
              height: 85, // Высота поля заголовка
              color: Color.fromRGBO(87, 142, 126, 1), // Фон заголовка
              // alignment: Alignment.centerLeft, // Выравнивание текста по центру
              child: Text(
                'Меню',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Color.fromRGBO(67, 67, 67, 1),
                  // Цвет текста
                ),
              ),
            ),
            ListTile(
              title: Text('Настройки', style: TextStyle(fontSize: 18)),
              onTap: () {
                // Реализуйте логику перехода в настройки
              },
            ),
            ListTile(
              title: Text('История записей', style: TextStyle(fontSize: 18)),
              onTap: () {
                // Реализуйте логику перехода на экран истории
              },
            ),
            ListTile(
              titleAlignment: ListTileTitleAlignment.bottom,
              title: Text('Выход', style: TextStyle(fontSize: 18)),
              onTap: () {
                // Реализуйте логику выхода из приложения
              },
            ),
          ],
        ),
      ),
      body: SafeArea(
        child: unfinishedNovels.isEmpty
            ? Center(
                child: CircularProgressIndicator()) // Показ индикатора загрузки
            : ListView.builder(
                padding: EdgeInsets.all(16),
                itemCount: unfinishedNovels.length,
                itemBuilder: (context, index) {
                  return Card(
                    elevation: 2,
                    margin: EdgeInsets.only(bottom: 16),
                    child: ListTile(
                      title: Text(unfinishedNovels[index]),
                      trailing: Icon(Icons.arrow_forward_ios),
                      onTap: () {
                        // Логика перехода к редактированию новеллы
                      },
                    ),
                  );
                },
              ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showRecordingModal,
        backgroundColor: Color.fromRGBO(87, 142, 126, 1),
        child: Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}
