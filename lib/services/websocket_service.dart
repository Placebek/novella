// import 'dart:convert';
// import 'package:web_socket_channel/web_socket_channel.dart';

// class WebSocketService {
//   final String url;
//   late WebSocketChannel _channel;

//   WebSocketService(this.url) {
//     _channel = WebSocketChannel.connect(Uri.parse(url));
//   }

//   // Метод для отправки сообщения
//   void sendMessage(String message) {
//     _channel.sink.add(jsonEncode({'message': message}));
//   }

//   // Метод для получения потока сообщений
//   Stream get messages => _channel.stream;

//   // Закрытие соединения
//   void dispose() {
//     _channel.sink.close();
//   }
// }
