import os

import bcrypt, uuid, sys, flask
from .mail_service import send_activation_mail
from .token_service import *
import datetime
from dotenv import load_dotenv


load_dotenv()
sys.path.append("..")
from mysql_methods.mysql import DB
from slugify import slugify
import datetime


class UserService:

    def __init__(self):
        self.db = DB()

    def register(self, data):

        if not data:
            raise ValueError('Data null')

        email = data["email"]
        password = data["password"]
        nickname = data["nickname"]

        if self.db.selection_command('*', 'users', 'email', email):
            return "email taken", 401

        if self.db.selection_command('*', 'users', 'nickname', nickname):
            return "nickname taken", 401

        hash_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        activation_link = uuid.uuid4()
        user_link = slugify(nickname)
        sql = "INSERT INTO `users` (`id`, `nickname`, `email`, `password`, `is_activated`, `activation_link`, `user_link`) VALUES (NULL, '{}', '{}', '{}', {}, '{}', '{}')".format(
            nickname, email, hash_password, int(False), activation_link, user_link)

        self.db.execute_commit(sql)

        send_activation_mail(email, activation_link)

        return flask.jsonify(True), 200

    def login(self, data):

        email = data["email"]
        password = data["password"]

        selection = self.db.selection_command('*', 'users', 'email', email)

        if not selection:
            return "user not found", 401

        compare = bcrypt.checkpw(password.encode(), selection[0]["password"].encode())

        if not compare:
            print("invalid password")
            return "invalid password", 401

        user_id = selection[0]["id"]
        user_nickname = selection[0]["nickname"]
        is_activated = selection[0]["is_activated"]

        payload = {"user_id": user_id, "email": email, "is_activated": is_activated}

        tokens = generate_tokens(payload)
        resp_data = flask.jsonify({"tokens": tokens,
                                   "user": {"user_id": user_id, "user_nickname": user_nickname, "email": email,
                                            "is_activated": is_activated}})
        res = flask.make_response(resp_data)

        res.set_cookie("refresh_token", value=tokens["refresh_token"], httponly=True,
                       expires=datetime.datetime.utcnow() + datetime.timedelta(days=30), domain=os.getenv("FRONT_DOMAIN"))

        return res

    def activation(self, link):
        print(link)
        res = self.db.selection_command("*", "users", "activation_link", link)

        if not res:
            return "bad url", 404

        sql = "UPDATE users SET is_activated ='{}' WHERE activation_link = '{}'".format(1, link)
        self.db.token(sql)
        sql = "UPDATE users SET activation_link = NULL WHERE activation_link = '{}'".format(link)
        self.db.token(sql)

        return flask.redirect("http://www.google.com", code=302, Response=None)

    def refresh(self, request):

        try:

            refresh_token = request.cookies.get("refresh_token")

            if not self.db.selection_command("*", "tokens", "refresh_token", refresh_token):
                return "invalid refresh_token", 401

            user_id = validate_refresh_token(refresh_token)["payload"]["user_id"]

            data = self.db.selection_command("*", "users", "id", user_id)[0]

            payload = {'user_id': data["id"],
                       'email': data["email"],
                       'is_activated': data["is_activated"]
                       }

            tokens = generate_tokens(payload)
            resp = {"tokens": tokens,
                    "user": {"user_id": data["id"], "user_nickname": data["nickname"], "email": data["email"],
                             "is_activated": data["is_activated"]}}
            res = flask.make_response(flask.jsonify(resp))

            res.set_cookie("refresh_token", value=tokens["refresh_token"], httponly=True,
                           expires=datetime.datetime.utcnow() + datetime.timedelta(days=30), domain=os.getenv("FRONT_DOMAIN"))

            return res, 200




        except Exception as e:
            print(e)
            return "invalid refresh_token", 401

    def logout(self, request):

        try:

            refresh_token = request.cookies.get("refresh_token")

            res = flask.make_response("")

            res.set_cookie("refresh_token", "", httponly=True, domain=os.getenv("FRONT_DOMAIN"))

            delete_token(refresh_token)

            return res, 200




        except Exception as e:
            print(e)
            return "invalid refresh_token", 401


    def get_check_nickname(self, request):
        try:
            data = request.get_json()
            email = data["email"]
            nickname = data["nickname"]
            print(data)
        except Exception as e:
            print(e)
            return flask.jsonify(), 400

        sql = f"SELECT * FROM users WHERE users.nickname = '{nickname}' OR users.email = '{email}'"



        selection = self.db.fetch(sql)
        print(selection)

        if selection:
            print("rjewojrioewjr")
            return flask.jsonify(True)

        return flask.jsonify(False)
