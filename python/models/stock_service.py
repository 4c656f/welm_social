import flask
import sys


sys.path.append("..")
from mysql_methods.mysql import DB
from mysql_methods.yfinance import *



class StockService:

    def __init__(self):
        self.db = DB()

    def search(self, request):
        try:
            req_data = request.get_json()
            symbol = req_data["symbol"]
        except:
            return 400
        sql = f"SELECT * FROM `tickers` WHERE `ticker` LIKE '%{symbol}%' OR `company_name` LIKE '%{symbol}%' LIMIT 10;"
        return flask.jsonify(self.db.fetch(sql)), 200

    def buy(self, request):
        try:

            req_data = request.get_json()
            user_id = req_data["user"]["user_id"]
            ticker = req_data["buy"]["ticker"].upper()
            amount = req_data["buy"]["amount"]
            buy_date = req_data["buy"]["buy_date"]


        except Exception as e:
            print(e)
            return flask.jsonify(False), 400


        selection_comand = f"SELECT * FROM user_dashboard WHERE user_id = {user_id} AND ticker = '{ticker}' AND buy_date = '{buy_date}'"
        selection = self.db.fetch(selection_comand)
        if selection:
            summ = selection[0]["amount"] + amount
            update = f"UPDATE user_dashboard SET amount = {summ} WHERE user_id = {user_id} AND ticker = '{ticker}' AND buy_date = '{buy_date}'"
            self.db.execute_commit(update)
            return flask.jsonify(True), 200

        sql = f"INSERT INTO `user_dashboard` (`id`, `user_id`, `ticker`, `buy_date`, `amount`) VALUES (NULL, '{user_id}', '{ticker}', '{buy_date}', {amount})"

        print(sql)
        self.db.execute_commit(sql)

        return flask.jsonify(True), 200

    def get_dashboard(self, request):
        try:

            req_data = request.get_json()
            user_id = req_data["user"]["user_id"]



        except Exception as e:
            print(e)
            return flask.jsonify(False), 400


        sql_selection = f"SELECT * FROM user_dashboard WHERE user_id = {user_id}"

        selection = self.db.fetch(sql_selection)

        print(selection)

        prices = get_dashboard_prices(selection)

        return flask.jsonify(prices)


    def get_char(self, request):
        try:

            req_data = request.get_json()
            ticker = req_data["ticker"]
            period = req_data["period"]
            interval = req_data["interval"]

            print(period, interval)


        except Exception as e:
            print(e)
            return flask.jsonify(False), 400

        return flask.jsonify(get_char(ticker, period, interval))

    def get_price(self, request):
        try:
            req_data = request.get_json()
            print(req_data)



        except Exception as e:
            print(e)
            return flask.jsonify(False), 400

        return flask.jsonify(get_current_price(req_data))
