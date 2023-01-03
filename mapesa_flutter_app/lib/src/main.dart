import 'package:Mapesa/src/features/message_handler.dart';
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  MessageHandler messageHandler = MessageHandler();

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Plugin example app'),
        ),
        body: Container(
          padding: const EdgeInsets.all(10.0),
          child: ListView.builder(
            shrinkWrap: true,
            itemCount: messageHandler._messages.length,
            itemBuilder: (BuildContext context, int i) {
              var message = _messages[i];

              return ListTile(
                title: Text('${message.sender} [${message.date}]'),
                subtitle: Text('${message.body} ${message.id}'),
              );
            },
          ),
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: () async {},
          child: const Icon(Icons.refresh),
        ),
      ),
    );
  }
}
