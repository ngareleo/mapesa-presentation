import 'package:flutter_sms_inbox/flutter_sms_inbox.dart';
import 'package:permission_handler/permission_handler.dart';

class MessageHandler {
  final SmsQuery _query = SmsQuery();
  late List<SmsMessage> _messages = [];

  MessageHandler() {
    fetchMessages();
  }

  Future<void> fetchMessages() async {
    var permission = await Permission.sms.status;
    if (permission.isGranted) {
      final messages = await _query.querySms(
        kinds: [SmsQueryKind.inbox],
        address: "MPESA",
        count: 10,
      );
      _messages = messages;
    } else {
      await Permission.sms.request();
    }
  }

  Future<List<SmsMessage>> getMessages() async {
    return _messages;
  }
}
