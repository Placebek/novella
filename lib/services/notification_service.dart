// import 'package:firebase_messaging/firebase_messaging.dart';

// class NotificationService {
//   static final FirebaseMessaging _firebaseMessaging =
//       FirebaseMessaging.instance;

//   static Future<void> initialize() async {
//     NotificationSettings settings =
//         await _firebaseMessaging.requestPermission();
//     if (settings.authorizationStatus == AuthorizationStatus.authorized) {
//       print('Разрешение на уведомления получено');
//     }

//     _firebaseMessaging.getToken().then((token) {
//       print('FCM Token: $token');
//     });
//   }
// }
