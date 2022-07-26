import flask_cors
import jwt
from flask import Flask, request, jsonify
import flask
from mysql_methods.mysql import DB
from models.user_service import UserService
import os
from middleware.token_private import *
from middleware.error_handler import *
from dotenv import load_dotenv
import json
from flask_cors import CORS, cross_origin
from models.stock_service import StockService















load_dotenv()

app = Flask(__name__)
CORS(app, support_credentials=True)

app.config['CORS_HEADERS'] = 'Content-Type'




@app.route("/login", methods=["POST"])
@cross_origin(supports_credentials=True)
def login():


    data = request.get_json()


    try:
        return UserService().login(data)
    except Exception as e:
        print(e)
        return str(e), 401


@app.route("/registration", methods=["POST"])
@cross_origin(supports_credentials=True)
def registration():
    
    data = request.get_json()
    print(data)
    return UserService().register(data)




@app.route("/logout", methods=["POST"])
@cross_origin(supports_credentials=True)
def logout():
    return UserService().logout(request)


@app.route("/activate/<link>", methods=["GET"])
@cross_origin(supports_credentials=True)
def activate(link):
    return UserService().activation(link)


@app.route("/refresh", methods=["POST"])
@cross_origin(supports_credentials=True)
def refresh():
    return UserService().refresh(request)

@app.route("/add_post", methods=["POST"])
@cross_origin(supports_credentials=True)
@private()
def add_post():
    return UserService().add_post(request)

@app.route("/add_comment", methods=["POST"])
@cross_origin(supports_credentials=True)
@private()
def add_comment():
    return UserService().add_comment(request)


@app.route("/like", methods=["POST"])
@cross_origin(supports_credentials=True)
@private()
def like():
    return UserService().like(request)

@app.route("/get_posts", methods=["POST"])
@cross_origin(supports_credentials=True)
def get_posts():
    return UserService().get_posts(request)

@app.route("/get_posts_by_ticker", methods=["POST"])
@cross_origin(supports_credentials=True)
def get_posts_by_ticker():
    return UserService().get_posts_by_ticker(request)

@app.route("/ticker_search", methods=["POST"])
@cross_origin(supports_credentials=True)
def ticker_search():
    return StockService().search(request)

@app.route("/buy", methods=["POST"])
@cross_origin(supports_credentials=True)
@private()
def buy():
    return StockService().buy(request)


@app.route("/get_dashboard", methods=["POST"])
@cross_origin(supports_credentials=True)
@private()
def get_dashboard():
    return StockService().get_dashboard(request)

@app.route("/save_post", methods=["POST"])
@cross_origin(supports_credentials=True)
@private()
def save_post():
    return UserService().save_post(request)

@app.route("/get_save_posts", methods=["GET"])
@cross_origin(supports_credentials=True)
@private()
def get_save_post():
    return UserService().get_save_posts(request)


@app.route("/get_char", methods=["POST"])
@cross_origin(supports_credentials=True)
def get_char():
    return StockService().get_char(request)

@app.route("/get_price", methods=["POST"])
@cross_origin(supports_credentials=True)
def get_day_price():
    return StockService().get_price(request)


@app.route("/get_check_nickname", methods=["GET"])
@cross_origin(supports_credentials=True)
def get_check_nickname():
    print(request)
    return UserService().get_check_nickname(request)




if __name__ == '__main__':
    app.run(host='0.0.0.0', port= os.getenv('PORT'), debug=True)