import 'package:flutter/material.dart';
import '../services/audio_service.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool isRecording = false;
  List<String> history = [];
  bool isUploading = false;

  @override
  void initState() {
    super.initState();
    AudioService.initialize();
  }

  @override
  void dispose() {
    AudioService.dispose();
    super.dispose();
  }

  Future<void> _startRecording() async {
    setState(() {
      isRecording = true;
    });
    await AudioService.startRecording();
  }

  Future<void> _stopRecording() async {
    try {
      final filePath = await AudioService.stopRecording();
      setState(() {
        isRecording = false;
        history.add(filePath); // Добавляем в историю
      });
    } catch (e) {
      print(e);
    }
  }

  Future<void> _uploadFile(String filePath) async {
    setState(() {
      isUploading = true;
    });
    try {
      await AudioService.uploadRecording(filePath);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Файл успешно загружен')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Ошибка загрузки: $e')),
      );
    } finally {
      setState(() {
        isUploading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Главная')),
      drawer: Drawer(
        child: ListView(
          children: [
            DrawerHeader(child: Text('Меню')),
            ListTile(
              title: Text('История записей'),
              onTap: () {},
            ),
          ],
        ),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (isRecording)
              CircularProgressIndicator() // Анимация во время записи
            else
              ElevatedButton(
                onPressed: _startRecording,
                child: Text('Начать запись'),
              ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: isRecording ? _stopRecording : null,
              child: Text('Остановить запись'),
            ),
            SizedBox(height: 20),
            if (isUploading) CircularProgressIndicator(),
            if (!isUploading)
              Expanded(
                child: ListView.builder(
                  itemCount: history.length,
                  itemBuilder: (context, index) {
                    return ListTile(
                      title: Text('Запись ${index + 1}'),
                      subtitle: Text(history[index]),
                      trailing: IconButton(
                        icon: Icon(Icons.upload),
                        onPressed: () => _uploadFile(history[index]),
                      ),
                    );
                  },
                ),
              ),
          ],
        ),
      ),
    );
  }
}
