// views/notification_view.dart
import 'package:flutter/material.dart';

class NotificationView extends StatelessWidget {
  final List<String> notifications;
  final Function onRefresh;

  const NotificationView({
    Key? key,
    required this.notifications,
    required this.onRefresh,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Уведомления'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => onRefresh(),
          ),
        ],
      ),
      body: ListView.builder(
        itemCount: notifications.length,
        itemBuilder: (context, index) {
          return ListTile(
            title: Text(notifications[index]),
          );
        },
      ),
    );
  }
}
