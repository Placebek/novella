class NotificationModel {
  final String message;
  final DateTime timestamp;

  NotificationModel({required this.message, required this.timestamp});

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      message: json['message'],
      timestamp: DateTime.parse(json['timestamp']),
    );
  }
}
