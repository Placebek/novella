import 'package:flutter/material.dart';
// import 'package:provider/provider.dart';
import 'screens/home_screen.dart';
import 'screens/login_screen.dart';
import 'services/notification_service.dart';
import 'services/storage_service.dart';
import 'screens/register_screen.dart';
import 'services/websocket_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  NotificationService notificationService = NotificationService();

  await notificationService.init();
  print("Notifications initialized.");

  // Инициализация локального хранилища
  int? userId = await StorageService.getUserId();

  // Проверяем наличие userId
  if (userId == null) {
    print('Пользователь не авторизован. WebSocket не подключен.');
  } else {
    const String websocketBaseUrl = 'ws://192.168.96.31:8080/';
    String websocketUrl = '$websocketBaseUrl?user_id=$userId';
    print('WebSocket URL: $websocketUrl');

    WebSocketService.connect(websocketUrl);
  }

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter App',
      showSemanticsDebugger: false,
      theme: ThemeData(primarySwatch: Colors.blue),
      initialRoute: '/login',
      routes: {
        '/login': (context) => LoginScreen(),
        '/home': (context) => HomeScreen(),
        '/register': (context) => RegisterScreen()
      },
    );
  }
}
