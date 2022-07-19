import yfinance as yf


msft = yf.Ticker("MSFT")



print(msft.news[0]["title"])