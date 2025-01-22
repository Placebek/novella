// presenters/notification_presenter.dart
import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';

import '../models/notification_model.dart';

class NotificationPresenter {
  final Function(List<String>) updateView;
  final WebSocketChannel _channel;

  NotificationPresenter({
    required this.updateView,
    required String wsUrl,
  }) : _channel = WebSocketChannel.connect(Uri.parse(wsUrl));

  final List<String> _notifications = [];

  void listenForNotifications() {
    _channel.stream.listen((data) {
      final decodedData = jsonDecode(data);
      final notification = NotificationModel.fromJson(decodedData);

      _notifications.add(notification.message);
      updateView(_notifications);
    });
  }

  void sendNotification(String message) {
    final payload = jsonEncode(
        {'message': message, 'timestamp': DateTime.now().toIso8601String()});
    _channel.sink.add(payload);
  }

  void dispose() {
    _channel.sink.close();
  }
}
