class Transaction {
  final String messageId;
  final String userId;
  final String transactionCode;
  final double transactionCost;
  final DateTime dateTime;
  final double balance;

  const Transaction(this.messageId, this.userId, this.transactionCode,
      this.transactionCost, this.dateTime, this.balance);
}

class SendMoneyTransaction extends Transaction {
  final String subject;
  final String phoneNumber;

  const SendMoneyTransaction(this.phoneNumber, this.subject) : super('', '', '', 0.0, null, 0.0);
}
