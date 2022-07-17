from functools import wraps
from flask import request
import sys, os, jwt
from dotenv import load_dotenv
sys.path.append("..")
from mysql_methods.mysql import DB

load_dotenv()


def error_handler():

    def _decorator(f):
        print("_decorator")
        @wraps(f)
        def __decorator(*args, **kwargs):

            try:

                return f(*args, **kwargs)
            except Exception as e:
                print(e)
                return "Exception"

        return __decorator

    return _decorator