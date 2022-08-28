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

    def sync_dashboard(self, request):
        try:
            req_data = request.get_json()
            user_id = req_data["user"]["user_id"]
            tickers = req_data["tickers"]



        except Exception as e:
            print(e)
            return flask.jsonify(False), 400

        delete_command = f"DELETE FROM `user_dashboard` WHERE user_id = {user_id}"
        self.db.execute_commit(delete_command)

        commit_list = []

        for i in tickers:
            commit_list.append((
                i["ticker"],
                i["amount"]
            ))


        sql = f"INSERT INTO `user_dashboard` (`user_id`, `ticker`, `amount`) VALUES ({user_id}, %s, %s)"

        self.db.execute_commit_many(sql, commit_list)





        return flask.jsonify(True), 200

    def get_dashboard(self, request):
        try:

            req_data = request.get_json()
            user_id = req_data["user"]["user_id"]



        except Exception as e:
            print(e)
            return flask.jsonify(False), 400


        sql_selection = f"SELECT * FROM user_dashboard WHERE user_id = {user_id} ORDER BY sort_id ASC"

        selection = self.db.fetch(sql_selection)



        return flask.jsonify(selection)


    def add_to_dashboard(self, request):
        try:

            req_data = request.get_json()
            user_id = req_data["user"]["user_id"]
            ticker = req_data["ticker"]
            amount = 1



        except Exception as e:
            print(e)
            return flask.jsonify(False), 400


        sql_selection = f"SELECT * FROM user_dashboard WHERE user_id = {user_id} ORDER BY sort_id ASC"

        selection = self.db.fetch(sql_selection)

        if not selection:
            sql = f"INSERT INTO `user_dashboard` (`sort_id`, `user_id`, `ticker`, `amount`) VALUES ({0}, {user_id}, '{ticker}', {amount})"
        else:
            sort_id = selection[0]["sort_id"] - 1
            sql = f"INSERT INTO `user_dashboard` (`sort_id`, `user_id`, `ticker`, `amount`) VALUES ({sort_id}, {user_id}, '{ticker}', {amount})"



        selection = self.db.execute_commit(sql)



        return flask.jsonify(selection)

    def delete_from_dashboard(self, request):
        try:

            req_data = request.get_json()
            user_id = req_data["user"]["user_id"]
            ticker = req_data["ticker"]


        except Exception as e:
            print(e)
            return flask.jsonify(False), 400


        sql_selection = f"DELETE FROM user_dashboard WHERE user_id = {user_id} AND ticker = '{ticker}'"

        self.db.execute_commit(sql_selection)



        return flask.jsonify(True)


    def sort_dashboard(self, request):
        try:

            req_data = request.get_json()
            user_id = req_data["user"]["user_id"]
            sort_arr = req_data["sort_arr"]

            commit_list = []

            for i in sort_arr:
                commit_list.append((
                    i["sort_id"],
                    i["ticker"]
                ))







        except Exception as e:
            print(e)
            return flask.jsonify(False), 400


        sql = f"UPDATE user_dashboard SET sort_id = %s WHERE user_id = {user_id} AND ticker = %s"

        self.db.execute_commit_many(sql, commit_list)



        return flask.jsonify(True)

    def change_amount(self, request):
        try:

            req_data = request.get_json()
            user_id = req_data["user"]["user_id"]
            amount = req_data["amount"]
            ticker = req_data["ticker"]

        except Exception as e:
            print(e)
            return flask.jsonify(False), 400


        sql = f"UPDATE user_dashboard SET amount = {amount} WHERE user_id = {user_id} AND ticker = '{ticker}'"

        self.db.execute_commit(sql)



        return flask.jsonify(True)


    def get_char(self, request):
        try:

            req_data = request.get_json()
            ticker = req_data["ticker"]
            period = req_data["period"]
            interval = req_data["interval"]




        except Exception as e:
            print(e)
            return flask.jsonify(False), 400

        return flask.jsonify(get_char(ticker, period, interval))

    def get_price(self, request):
        try:
            req_data = request.get_json()


        except Exception as e:
            print(e)
            return flask.jsonify(False), 400

        return flask.jsonify(get_current_price(req_data))
