import 'package:flutter/material.dart';

class RegisterScreen extends StatelessWidget {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController nameController = TextEditingController();
  final TextEditingController phoneController = TextEditingController();

  RegisterScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset:
          true, // Позволяет адаптироваться к появлению клавиатуры
      body: SafeArea(
        child: Stack(
          children: [
            // Градиентный фон
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Color.fromARGB(255, 255, 250, 236),
                    Color.fromARGB(255, 255, 250, 236),
                  ],
                ),
              ),
            ),
            Center(
              child: SingleChildScrollView(
                // Позволяет прокручивать содержимое при появлении клавиатуры
                padding: const EdgeInsets.symmetric(horizontal: 40.0),
                child: Container(
                  decoration: BoxDecoration(
                    color: const Color.fromRGBO(245, 236, 213, 1),
                    borderRadius: BorderRadius.circular(15),
                  ),
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const Text(
                        'Регистрация',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 30,
                          color: Colors.black,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 20),
                      // Поле для имени
                      TextField(
                        controller: nameController,
                        decoration: const InputDecoration(
                          labelText: 'Имя',
                          border: OutlineInputBorder(),
                          contentPadding: EdgeInsets.all(10.0),
                        ),
                      ),
                      const SizedBox(height: 15),
                      // Поле для номера телефона
                      TextField(
                        controller: phoneController,
                        decoration: const InputDecoration(
                            labelText: 'Телефон',
                            border: OutlineInputBorder(),
                            contentPadding: EdgeInsets.all(10.0),
                            focusColor: Color.fromRGBO(0, 0, 0, 1)),
                        keyboardType: TextInputType.phone,
                      ),
                      const SizedBox(height: 15),
                      // Поле для email
                      TextField(
                        controller: emailController,
                        decoration: const InputDecoration(
                          labelText: 'Email',
                          border: OutlineInputBorder(),
                          contentPadding: EdgeInsets.all(10.0),
                        ),
                      ),
                      const SizedBox(height: 15),
                      // Поле для пароля
                      TextField(
                        controller: passwordController,
                        decoration: const InputDecoration(
                          labelText: 'Пароль',
                          border: OutlineInputBorder(),
                          contentPadding: EdgeInsets.all(10.0),
                        ),
                        obscureText: true,
                      ),
                      const SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: () {
                          // Логика регистрации
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                                content: Text('Регистрация завершена')),
                          );
                          Navigator.pushReplacementNamed(context, '/login');
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor:
                              const Color.fromRGBO(87, 142, 126, 1),
                        ),
                        child: const Text(
                          'Зарегистрироваться',
                          style: TextStyle(color: Colors.white),
                        ),
                      ),
                      const SizedBox(height: 10),
                      TextButton(
                        onPressed: () {
                          // Переход на экран входа
                          Navigator.pushReplacementNamed(context, '/login');
                        },
                        child: const Text(
                          'Уже есть аккаунт? Войти',
                          style: TextStyle(color: Colors.blue),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
