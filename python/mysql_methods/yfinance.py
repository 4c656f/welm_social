import datetime
import time
import yfinance as yf
import multiprocessing
import numpy as np


def get_current_price(symbol):
    def request_thread(L, ticker):
        try:
            # data = yf.download(i, period="1d", interval='1d')
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
    return (L)


def get_char(ticker, period, interval):

    L = {}
    try:
        data = yf.download(ticker, period= period, interval= interval)

        date = data['Close'].index.strftime('%Y-%m-%d').tolist()
        price = data['Close']

        nan_array = np.isnan(price)
        not_nan_array = ~ nan_array
        array2 = price[not_nan_array].tolist()

        data_return = []
        for j in range(len(array2)):
            data_return.append({"date": date[j], "price": round(array2[j], 2)})



        L.update({ticker: data_return})

    except Exception as e:
        print(e)



    return (L)






def get_dashboard_prices(list_of_dashboards):
    def request_thread(L, ticker, buy_date):
        try:
            buy = yf.download(ticker, start=buy_date, end= buy_date + datetime.timedelta(days=1), interval='1d')["Close"][0]
            current = yf.download(ticker, period="2d", interval='1d')["Close"][-1]
            L.append({ticker: {
                "buy_date": buy_date,
                "buy": buy,
                "current": current
            }})
            return
        except Exception as e:
            print(e)
            return

    with multiprocessing.Manager() as manager:
        L = manager.list()
        threads = []

        for i in list_of_dashboards:
            t = multiprocessing.Process(target=request_thread, args=(L, i["ticker"], i["buy_date"]))
            t.start()
            threads.append(t)

        for t in threads:
            t.join()

        L = list(L)

    return (L)


