import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:dio/dio.dart';
import 'package:fluttertoast/fluttertoast.dart';

import '../../models/transactions/transaction.dart' as mpesa_transaction;

class FirebaseUploadService {
  final db = FirebaseFirestore.instance;
  static const firebaseBatchSize = 400;

  Future<bool> batchWriteToFirebase(
      {required List<mpesa_transaction.Transaction?> transactions}) async {
    final batch = db.batch();
    for (var transaction in transactions) {
      var transactionRef =
          db.collection("transactions").doc(transaction?.transactionCode);
      batch.set(transactionRef, transaction?.toJson());
    }
    try {
      await batch.commit();
    } catch (error) {
      return false;
    }

    return true;
  }
}

class DioUploadService {
  final dio = Dio();
  final String uploadEndPoint;

  DioUploadService({required this.uploadEndPoint}) {
    dio.options
      ..baseUrl = uploadEndPoint
      ..connectTimeout = 100000;

    dio.interceptors.add(InterceptorsWrapper(onError: (DioError e, handler) {
      Fluttertoast.showToast(
        msg: "Error uploading messages",
        toastLength: Toast.LENGTH_LONG,
      );
      return handler.next(e);
    }));
  }

  Future<bool> uploadTransactions(
      List<mpesa_transaction.Transaction?> transactions) async {
    try {
      await dio.post("/upload",
          data: {
            "transactions": transactions
                .map((transaction) => transaction?.toJson())
                .toList()
          },
          onSendProgress: (int sent, int total) {});
    } catch (error) {
      return false;
    }
    return true;
  }
}
