import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_sms_inbox/flutter_sms_inbox.dart';
import 'package:mapesa/src/features/authentication/user_handler.dart';
import 'package:mapesa/src/features/message_handler.dart';
import 'package:mapesa/src/pages/login.dart';

import 'firebase_options.dart';
import 'src/features/upload/message_upload.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  bool isSignedIn = false;
  UserHandler userHandler = UserHandler();

  @override
  void initState() {
    super.initState();
    isSignedIn = userHandler.isSignedIn();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "Mapesa",
      home: isSignedIn ? const HomePage() : const LoginScreen(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text('Leo\'s app'),
        ),
        body: const Center(
          child: TransactionList(),
        ));
  }
}

class TransactionList extends StatefulWidget {
  const TransactionList({Key? key}) : super(key: key);

  @override
  State<TransactionList> createState() => _TransactionListState();
}

class _TransactionListState extends State<TransactionList> {
  MessageHandler messageHandler = MessageHandler();
  late Future<List<SmsMessage>> messages;
  UploadService uploadService = UploadService();

  @override
  void initState() {
    super.initState();
    messages = messageHandler.fetchMessages();
    uploadService.uploadMessages();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10.0),
      child: FutureBuilder(
          future: messages,
          builder: (context, AsyncSnapshot<List<SmsMessage>> snapshot) {
            if (snapshot.hasData) {
              return ListView.builder(
                shrinkWrap: true,
                itemCount: snapshot.data?.length,
                itemBuilder: (BuildContext context, int i) {
                  var message = snapshot.data?.elementAt(i);
                  return ListTile(
                    title: Text('${message?.sender} [${message?.date}]'),
                    subtitle: Text('${message?.body} ${message?.id}'),
                  );
                },
              );
            }
            return const CircularProgressIndicator();
          }),
    );
  }
}
