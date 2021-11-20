from pymongo import MongoClient
from datetime import datetime

URL = "mongodb://127.0.0.1:27017/CallSaul"
db_connection = MongoClient(URL)['CallSaul']
t_table = db_connection['transactions']


query = {
    "$and": [{"subject": "ODIBETS "}, {"dateTime": {
        "$gte": datetime(2021, 9, 1)
    }}]
}

t_amount, cost_amount = 0, 0
t_s = t_table.find(query)
t_list = [t for t in t_s]

count = 0
for t in t_list:
    print(f"{count}. {t.get('transaction_amount')}, cost {t.get('transaction_cost')} T: {t}")
    t_amount += t.get("transaction_amount")
    cost_amount += t.get("transaction_cost")


print(f"Transaction amount : {t_amount}")
print(f"Transaction cost : {cost_amount}")