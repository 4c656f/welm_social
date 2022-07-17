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
from flask_cors import CORS
















load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route("/login", methods=["POST"])
def login():


    data = request.get_json()



    try:
        return UserService().login(data)
    except Exception as e:
        print(e)
        return str(e), 401


@app.route("/registration", methods=["POST"])
def registration():
    
    data = request.get_json()
    return UserService().register(data)




@app.route("/logout", methods=["POST"])
def logout():
    return UserService().logout(request)


@app.route("/activate/<link>", methods=["GET"])
def activate(link):
    return UserService().activation(link)


@app.route("/refresh", methods=["GET"])
def refresh():
    return UserService().refresh(request)

@app.route("/add_post", methods=["POST"])
@private()
def add_post():
    return UserService().add_post(request)

@app.route("/add_comment", methods=["POST"])
@private()
def add_comment():
    return UserService().add_comment(request)


@app.route("/like", methods=["POST"])
@private()
def like():
    return UserService().like(request)

@app.route("/get_posts", methods=["GET"])
def get_posts():
    return UserService().get_posts(request)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port= os.getenv('PORT'), debug=True)