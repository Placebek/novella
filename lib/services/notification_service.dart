import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:permission_handler/permission_handler.dart';

class NotificationService {
  final FlutterLocalNotificationsPlugin _flutterLocalNotificationsPlugin =
      FlutterLocalNotificationsPlugin();

  // Инициализация уведомлений
  Future<void> init() async {
    // Инициализация для Android
    var initializationSettingsAndroid =
        const AndroidInitializationSettings('@mipmap/ic_launcher');

    // Объединение всех настроек (только Android)
    var initializationSettings = InitializationSettings(
      android: initializationSettingsAndroid,
    );

    // Инициализация плагина
    await _flutterLocalNotificationsPlugin.initialize(initializationSettings,
        onDidReceiveNotificationResponse: onDidReceiveNotificationResponse);

    // Запрос разрешений
    await _requestNotificationPermission();
  }

  // Запрос разрешений на уведомления
  Future<void> _requestNotificationPermission() async {
    if (await Permission.notification.request().isGranted) {
      // Разрешение получено
      print("Permission granted for notifications.");
    } else {
      // Разрешение не получено
      print("Permission denied for notifications.");
    }
  }

  // Показать уведомление
  Future<void> showNotification(String message) async {
    print("Attempting to show notification...");

    // Настройки для Android
    const androidPlatformChannelSpecifics = AndroidNotificationDetails(
      'high_priority_channel', // Уникальный ID канала
      'High Priority Notifications', // Название канала
      channelDescription:
          'This channel is used for high priority notifications.', // Описание канала
      importance: Importance.high,
      priority: Priority.high,
      showWhen: false, // Отключаем отображение времени
      playSound: true, // Включаем звук
    );

    // Объединение настроек для Android (только Android)
    var platformChannelSpecifics = NotificationDetails(
      android: androidPlatformChannelSpecifics,
    );

    try {
      // Показ уведомления
      await _flutterLocalNotificationsPlugin.show(
        0, // ID уведомления
        'Жаңааа хабаррр. Біз жеңдік🥳🥳🥳🥳', // Заголовок
        message, // Текст уведомления
        platformChannelSpecifics,
        payload: 'Custom Payload', // Данные для обработки при нажатии
      );
      print("Notification displayed successfully!");
    } catch (e) {
      print("Error displaying notification: $e");
    }
  }

  // Обработка нажатия на уведомление
  Future<void> onDidReceiveNotificationResponse(
      NotificationResponse notificationResponse) async {
    String? payload = notificationResponse.payload;
    // Выводим данные payload (если они есть)
    if (payload != null) {
      print('Notification payload: $payload');
      // Здесь можно обработать переход к экрану или другие действия при нажатии
    }
  }
}
