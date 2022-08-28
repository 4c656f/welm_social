from functools import wraps
from flask import request
import sys, os, jwt
from dotenv import load_dotenv
sys.path.append("..")
from mysql_methods.mysql import DB

load_dotenv()


def private():

    def _decorator(f):

        @wraps(f)
        def __decorator(*args, **kwargs):

            try:
                access_token = request.headers['access_token']
                print(access_token)

                db = DB()

                selection = db.fetch(f"SELECT * FROM `tokens` WHERE `access_token` = '{access_token}'")
                print(selection)
                if not selection:
                    return "invalid access_token", 401

                jwt.decode(access_token, key=os.getenv('JWT_ACCESS_TOKEN'), algorithms=['HS256', ])



            except:
                print("protected")
                return "invalid access_token", 401

            return f()

        return __decorator

    return _decorator