import time
import yfinance as yf
import multiprocessing
import pandas as pd
import statistics
import numpy as np
import math
import datetime


def get_current_price(symbol):
    def request_thread(L, ticker):
        try:
            #data = yf.download(i, period="1d", interval='1d')
            data2 = yf.download(i, period="2d", interval='1d')
            c = ((data2['Close'][-1] - data2['Close'][0]) / data2['Close'][0] * 100)
            L.update({i: round(c, 2)})
            return
        except Exception as e:
            print(e)




    with multiprocessing.Manager() as manager:
        L = manager.dict()
        threads = []


        for i in symbol:


            t = multiprocessing.Process(target=request_thread, args=(L, i))
            t.start()
            threads.append(t)


        for t in threads:
            t.join()

        L = dict(L)
    print(L)
    return(L)








def get_one_year(symbol):
    def request_thread(L, ticker):
        try:
            data = yf.download(i, period="1y", interval='1wk')

            date = data['Close'].index.strftime('%Y-%m-%d').tolist()
            pricee= data['Close']

            nan_array = np.isnan(pricee)
            not_nan_array = ~ nan_array
            array2 = pricee[not_nan_array].tolist()




            data_return = []
            for j in range(len(array2)):
                data_return.append({"date": date[j], "price": round(array2[j], 2)})

            # c = ((data['Close'][-1] - data2['Close'][0]) / data2['Close'][0] * 100)

            L.update({ticker: data_return})
            return
        except Exception as e:
            print(e)




    with multiprocessing.Manager() as manager:
        L = manager.dict()
        threads = []


        for i in symbol:


            t = multiprocessing.Process(target=request_thread, args=(L, i))
            t.start()
            threads.append(t)


        for t in threads:
            t.join()

        L = dict(L)


    return(L)




start_time = time.time()
buy = yf.download("TSLA AAPL HOOD PINS", start="2021-07-30", end="2021-07-31", interval='1d', threads = True)
time1 = time.time() - start_time


class StockService:

    def __init__(self):
        # self.db = DB()
        # соеденить с базой

    def search(self, request):

        req_data = request.get_json()

        try:
            symbol = req_data["symbol"]
        except:
            return 400
        sql = f"SELECT * FROM `tickers` WHERE `ticker` LIKE '%{symbol}%' OR `company_name` LIKE '%{symbol}%' LIMIT 10;"
        return flask.jsonify(self.db.fetch(sql)), 200

    def buy(self, request):
        # req_data = request.get_json()
        




def get_current_pricee(symbol):
    def request_thread(L, ticker):
        try:
            print(ticker)
            buy = yf.download(ticker, start="2021-07-30", end="2021-07-31", interval='1d')
            print(buy["Close"][0])
            L.update({ticker: buy["Close"][0]})
            return
        except Exception as e:
            pass




    with multiprocessing.Manager() as manager:
        L = manager.dict()
        threads = []


        for i in symbol:


            t = multiprocessing.Process(target=request_thread, args=(L, i))
            t.start()
            threads.append(t)


        for t in threads:
            t.join()

        L = dict(L)


    print(L)
    return(L)


start_time2 = time.time()
get_current_pricee(["TSLA", "AAPL", "HOOD", "PINS"])
time2 = time.time() - start_time2

print(time1)
print(time2)