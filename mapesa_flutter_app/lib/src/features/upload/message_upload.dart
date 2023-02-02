import 'dart:core';

import 'package:fluttertoast/fluttertoast.dart';
import 'package:mapesa/src/features/upload/upload_services.dart';
import 'package:mapesa/src/models/transactions/transaction.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../message_handler.dart';
import 'mapper.dart';

enum MessageType {
  upToDate(message: "Up to date"),
  success(message: "Upload successfully"),
  error(message: "Upload failed");

  final String message;

  const MessageType({required this.message});
}

class UploadService {
  // get the messages
  final MessageHandler messageHandler = MessageHandler();
  final firebaseUploadService = FirebaseUploadService();
  final Mapper mapper = Mapper();

  Future<List<Transaction?>> getTransactions() async {
    var prefs = await SharedPreferences.getInstance();
    var latestID = prefs.getInt("latest_id") ?? 0;
    var messages = await messageHandler.fetchMessages(latestID: latestID);
    if (messages.isEmpty) {
      return [];
    }
    var transactions = [
      for (var message in messages)
        mapper.mapMessageToTransaction(
            message: message.body, messageID: message.id)
    ];
    transactions.removeWhere((transaction) => transaction == null);
    return transactions;
  }

  Future<void> uploadMessages() async {
    var transactions = await getTransactions();
    if (transactions.isEmpty) {
      showToast(messageType: MessageType.upToDate);
      return;
    }
    var uploadComplete = await firebaseUploadService.batchWriteToFirebase(
        transactions: transactions);
    if (!uploadComplete) {
      showToast(messageType: MessageType.error);
      return;
    } else {
      showToast(messageType: MessageType.success);
      var prefs = await SharedPreferences.getInstance();
      var latestID = transactions.first?.messageId;
      prefs.setInt("latest_id", latestID!);
    }
  }

  void showToast({required MessageType messageType}) {
    Fluttertoast.showToast(
      msg: messageType.message,
      toastLength: Toast.LENGTH_LONG,
    );
  }
}
