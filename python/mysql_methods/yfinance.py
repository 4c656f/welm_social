import datetime
import yfinance as yf
import multiprocessing
import numpy as np


period_cases={
    "1d":{
        "period":"2d",
        "interval":"1d"
    },
    "1mo":{
        "period":"1mo",
        "interval":"1d"
    },"1y":{
        "period":"1y",
        "interval":"1d"
    },"max":{
        "period":"max",
        "interval":"3mo"
    }
}

def get_current_price(request_data):
    def request_thread(L, ticker, period):

        try:
            if period:
                history_period = period_cases[period]["period"]
                history_interval = period_cases[period]["interval"]
            else:
                history_period = "2d"
                history_interval = "1d"

            print(history_period, history_interval, "---------interval")

            data2 = yf.download(ticker,  period=history_period)



            L.update({ticker: {
                "open": round(data2['Close'][0], 2),
                "close": round(data2['Close'][-1],2)
            }})
            return
        except Exception as e:
            print(e)

    if len(request_data["tickers"]) == 1:
        response_dict = {}

        request_thread(response_dict, request_data["tickers"][0]["ticker"], request_data["period"])

        return response_dict






    with multiprocessing.Manager() as manager:
        L = manager.dict()
        threads = []

        for i in request_data["tickers"]:
            t = multiprocessing.Process(target=request_thread, args=(L, i["ticker"],  request_data["period"]))
            t.start()
            threads.append(t)

        for t in threads:
            t.join()

        L = dict(L)

    return (L)


def get_char(ticker, period, interval):

    L = {}
    try:
        print(period, interval)
        ticker_history = yf.Ticker(ticker)
        data = ticker_history.history(period=period, interval= interval)
        # data = yf.download(ticker, period= period, interval= interval, threads = True,)

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






# def get_dashboard_prices(list_of_dashboards):
#     def request_thread(L, ticker, buy_date):
#         try:
#             buy = yf.download(ticker, start=buy_date, end= buy_date + datetime.timedelta(days=1), interval='1d')["Close"][0]
#             current = yf.download(ticker, period="2d", interval='1d')["Close"][-1]
#             L.append({ticker: {
#                 "buy_date": buy_date,
#                 "buy": buy,
#                 "current": current
#             }})
#             return
#         except Exception as e:
#             print(e)
#             return
#
#     with multiprocessing.Manager() as manager:
#         L = manager.list()
#         threads = []
#
#         for i in list_of_dashboards:
#             t = multiprocessing.Process(target=request_thread, args=(L, i["ticker"], i["buy_date"]))
#             t.start()
#             threads.append(t)
#
#         for t in threads:
#             t.join()
#
#         L = list(L)
#
#     return (L)



