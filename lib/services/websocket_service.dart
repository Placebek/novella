import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:web_socket_channel/status.dart' as status;
import 'notification_service.dart';

class WebSocketService {
  static WebSocketChannel? _channel;

  // Подключение к WebSocket
  static void connect(String serverUrl) {
    _channel = WebSocketChannel.connect(Uri.parse(serverUrl));
    print('WebSocket подключен: $serverUrl');

    // Слушаем входящие сообщения
    _channel?.stream.listen(
      (message) {
        print('Получено сообщение: $message');
        // Обрабатываем сообщение (например, отправляем уведомление)
        handleNotification(message);
      },
      onError: (error) {
        print('Ошибка WebSocket: $error');
      },
      onDone: () {
        print('Соединение WebSocket закрыто.');
      },
    );
  }

  // Обработка уведомлений
  static void handleNotification(String message) {
    NotificationService().showNotification(message);
    print('Уведомление показано');
  }

  // Закрытие соединения
  static void disconnect() {
    _channel?.sink.close(status.normalClosure);
    print('WebSocket отключен');
  }

  // Отправка сообщения через WebSocket
  static void sendMessage(String message) {
    _channel?.sink.add(message);
    print('Сообщение отправлено: $message');
  }
}
