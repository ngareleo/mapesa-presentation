from pymongo import MongoClient
from datetime import datetime


class TransactionManager:

    def __init__(self, u_id):
        URL = "mongodb://127.0.0.1:27017/CallSaul"
        self._db_connection = MongoClient(URL)['CallSaul']
        self._t_table = self._db_connection['transactions']
        self._user = u_id

    def get_balance(self):
        query = {
            "user_id": self._user
        }
        latest_t = self._t_table.find(query).sort("dateTime", -1)
        if latest_t.count() != 0:
            return {
                'balance': latest_t[0].get('balance')
            }
        return {
            'balance': -1
        }

    def get_recent_transactions(self):

        query = {
            "user_id": self._user
        }
        latest_ts = self._t_table.find(query).sort('dateTime', -1).limit(8)
        data = [t for t in latest_ts]
        # safely extract the important information
        values = self.clean_data(data)
        return {'data': values}

    def get_monthly_info(self):

        # this month
        now = datetime.now()
        t_month = now.month
        t_year = now.year

        # get all the transactions this month
        query = {
            "dateTime": {
                "$gt": datetime(t_year, t_month, 1, 0, 0)
            }
        }
        transactions = self._t_table.find(query)
        data = [t for t in transactions]
        # safely extract the important information
        values = self.clean_data(data)

        # we look for income, spending, transaction_fees

        monthly_i = self.process_transactions(values)
        return {
            'details': {
                'income': monthly_i['income'],
                'spent': monthly_i['spent'],
                'balance': self.get_balance(),
                'rt': self.get_recent_transactions(),
                'monthly_data': self.get_monthly_data(10)
            }
        }

    @staticmethod
    def process_transactions(transactions):
        details = {
            'income': 0,
            'spent': 0,
            'transaction_cost': 0
        }

        for transaction in transactions:

            t_type = transaction.get('type')
            if t_type == 'Send Money' or t_type == 'Pay Bill Money' or t_type == 'Withdraw':
                t_cost = transaction.get('transaction_cost')
                t_amount = transaction.get('transaction_amount')
                details['spent'] += t_cost + t_amount
                details['transaction_cost'] += t_cost
            elif t_type == 'Fuliza':
                t_cost = transaction.get('transaction_cost')
                details['transaction_cost'] += t_cost
            elif t_type == 'Lipa na MPESA' or t_type == 'Airtime':
                t_amount = transaction.get('transaction_amount')
                details['spent'] += t_amount
            elif t_type == 'Recieve Money' or t_type == 'Deposit':
                t_amount = transaction.get('transaction_amount')
                details['income'] += t_amount

        return details

    @staticmethod
    def clean_data(transactions: list) -> list:
        t_s = [t for t in transactions]
        values = []
        date_today = datetime.now()

        for item in t_s:
            t_map = {

                "balance": item.get("balance"),
                "message_id": item.get("message_id"),
                "subject": item.get("subject"),
                "subject_phoneNumber": item.get("subject_phoneNumber"),
                "transaction_amount": item.get("transaction_amount"),
                "transaction_code": item.get("transaction_code"),
                "transaction_cost": item.get("transaction_cost"),
                "dateTime": str(item.get("dateTime")),
                "type": item.get("type"),
                "location": item.get("location"),
                "subject_account": item.get("subject_account")
            }
            values.append(t_map)
        return values

    def get_monthly_data(self, lim):
        # for last 7 months, each month we go through the db
        monthly_data = []

        today = datetime.now()
        this_y, this_m = today.year, today.month
        req = 0
        all_data = []
        p_date = today
        while this_y > 0:
            while this_m >= 1:

                # we get the transactions here
                date = datetime(this_y, this_m, 1)
                query = {
                    '$and': [{"dateTime": {"$gte": date}}, {"dateTime": {"$lte": p_date}}]
                }

                m_ts = self._t_table.find(query)
                ts = [m_t for m_t in m_ts]

                m_data = self.process_transactions(ts)
                month = {
                    'label': {
                        "year": this_y,
                        "month": this_m
                    },
                    'data': m_data
                }
                all_data.append(month)
                if req == lim:
                    return all_data

                p_date = date
                this_m -= 1
                req += 1
            if this_m == 0:
                this_m = 12
            this_y -= 1










