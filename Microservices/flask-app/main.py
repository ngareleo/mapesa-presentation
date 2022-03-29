import json
from flask import Flask, request
from models import TransactionManager
from json import dumps

app = Flask(__name__)


@app.route('/<user_id>')
def index(user_id):
    manager = TransactionManager(user_id)
    return dumps(manager.get_monthly_info())


@app.route('/dash')
def dash():
    uuid = request.args.get('uuid')
    manager = TransactionManager(uuid)
    return dumps(manager.get_monthly_info())


@app.route('/figure1')
def fig_one():
    uuid = request.args.get('uuid')
    return dumps(TransactionManager(uuid).get_monthly_data(5))


@app.route('/test')
def test():
    return dumps(TransactionManager('123').get_monthly_data(3))


@app.route('/monthly-figures')
def get_monthly_figures():
    return dumps(TransactionManager('123').get_monthly_data(3))