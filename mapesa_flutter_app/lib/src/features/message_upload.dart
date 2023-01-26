import 'dart:core';

import 'package:dio/dio.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:mapesa/src/utils/patterns.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/transactions/airtime_for_transaction.dart';
import '../models/transactions/airtime_transaction.dart';
import '../models/transactions/deposit_transaction.dart';
import '../models/transactions/fuliza_transaction.dart';
import '../models/transactions/lipa_na_mpesa_transaction.dart';
import '../models/transactions/paybill_transaction.dart';
import '../models/transactions/receive_money_transaction.dart';
import '../models/transactions/send_money_transaction.dart';
import '../models/transactions/transaction.dart';
import '../models/transactions/withdraw_transaction.dart';
import 'message_handler.dart';

class UploadService {
  // get the messages
  final MessageHandler messageHandler = MessageHandler();
  final Mapper mapper = Mapper();
  final dio = Dio();

  UploadService() {
    dio.options
      ..baseUrl = "https://e28a-41-84-131-94.ngrok.io/"
      ..connectTimeout = 100000;

    dio.interceptors.add(InterceptorsWrapper(onError: (DioError e, handler) {
      Fluttertoast.showToast(
        msg: "Error uploading messages",
        toastLength: Toast.LENGTH_LONG,
      );
      return handler.next(e);
    }));
  }

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
      Fluttertoast.showToast(
        msg: "Up to date!",
        toastLength: Toast.LENGTH_LONG,
      );
      return;
    }
    var response = await dio.post("/upload",
        data: {
          "transactions":
              transactions.map((transaction) => transaction?.toJson()).toList()
        },
        onSendProgress: (int sent, int total) {});
    showUploadStatus(hasUploaded: response.statusCode == 200);
    var prefs = await SharedPreferences.getInstance();
    prefs.setInt("latest_id",
        transactions.first?.messageId ?? prefs.getInt("latest_id") ?? 0);
  }

  void showUploadStatus({required bool hasUploaded}) {
    if (hasUploaded) {
      Fluttertoast.showToast(
        msg: "Uploaded",
        toastLength: Toast.LENGTH_LONG,
      );
    } else {
      Fluttertoast.showToast(
        msg: "Failed",
        toastLength: Toast.LENGTH_LONG,
      );
    }
  }
}

class Mapper {
  /// if regex pattern is null, the message is invalid

  final patterns = const Patterns();

  Transaction? getTransaction(
      {required TransactionType type,
      required String message,
      required int messageID,
      required RegExp expression}) {
    var match = expression.firstMatch(message);
    if (match == null) {
      return null;
    }
    switch (type) {
      case TransactionType.receiveMoney:
        return ReceiveMoneyTransaction.fromMpesaMessage(
            messageID: messageID, match: match);
      case TransactionType.sendMoney:
        return SendMoneyTransaction.fromMpesaMessage(
            messageID: messageID, match: match);
      case TransactionType.lipaNaMpesa:
        return LipaNaMpesaTransaction.fromMpesaMessage(
            messageID: messageID, match: match);
      case TransactionType.payBillMoney:
        return PaybillTransaction.fromMpesaMessage(
            messageID: messageID, match: match);
      case TransactionType.airtime:
        return AirtimeTransaction.fromMpesaMessage(
            messageID: messageID, match: match);
      case TransactionType.withdrawMoney:
        return WithdrawTransaction.fromMpesaMessage(
            messageID: messageID, match: match);
      case TransactionType.fuliza:
        return FulizaTransaction.fromMpesaMessage(
            messageID: messageID, match: match);
      case TransactionType.depositMoney:
        return DepositTransaction.fromMpesaMessage(
            messageID: messageID, match: match);
      case TransactionType.airtimeFor:
        return AirtimeForTransaction.fromMpesaMessage(
            messageID: messageID, match: match);
    }
  }

  Transaction? mapMessageToTransaction(
      {required String? message, required int? messageID}) {
    if (messageID == null || message == null) {
      return null;
    }
    for (var map in patterns.mappingPatterns.entries) {
      var transactionType = map.key;
      var expression = patterns.transactionPatterns[transactionType];
      var isMatch = expression?.hasMatch(message);
      if (isMatch != null && expression != null && isMatch) {
        return getTransaction(
            type: transactionType,
            message: message,
            messageID: messageID,
            expression: expression);
      }
    }
    return null;
  }
}
