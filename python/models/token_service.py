import jwt
import datetime
import os
from dotenv import load_dotenv
import sys
sys.path.append("..")
from mysql_methods.mysql import DB
load_dotenv()


def save_token(user_id, refresh_token, access_token):
    
    db = DB()
    print(db.selection_command('*', 'tokens', 'user_id', user_id))

    if db.selection_command('*', 'tokens', 'user_id', user_id):
        sql = "UPDATE tokens SET refresh_token='{}', access_token='{}' WHERE user_id= '{}'".format(refresh_token ,access_token, user_id)
        db.token(sql)
        return


    sql = "INSERT INTO `tokens` (`id`, `user_id`, `refresh_token`, `access_token`) VALUES (NULL, '{}', '{}', '{}')".format(user_id, refresh_token, access_token)
    
    db.token(sql)



def generate_tokens(payload):

    access_token = jwt.encode(
        {"exp": datetime.datetime.utcnow() + datetime.timedelta(seconds = 60), "payload": payload},
        os.getenv('JWT_ACCESS_TOKEN'))


    refresh_token = jwt.encode(
        {"exp": datetime.datetime.utcnow() + datetime.timedelta(days=30), "payload": payload},
        os.getenv('JWT_REFRESH_TOKEN'))


    save_token(payload["user_id"], refresh_token, access_token)
    

    return {"access_token": access_token, "refresh_token": refresh_token}

def validate_refresh_token(refresh_token):
    return jwt.decode(refresh_token, key=os.getenv('JWT_REFRESH_TOKEN'), algorithms=['HS256', ])

def delete_token(refresh_token):

    sql = "DELETE FROM tokens WHERE refresh_token = '{}'".format(refresh_token)
    DB().token(sql)






