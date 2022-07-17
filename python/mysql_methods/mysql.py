import pymysql
import os
from dotenv import load_dotenv


load_dotenv()


class DB:

    def __init__(self):
        self.host = os.getenv('DB_HOST')
        self.user = os.getenv('DB_USER')
        self.password = os.getenv('DB_PASSWORD')
        self.db = "users"

    def __connect__(self):
        self.con = pymysql.connect(host=self.host, user=self.user, password=self.password, db=self.db, cursorclass=pymysql.cursors.
                                   DictCursor)
        self.cur = self.con.cursor()

    def __disconnect__(self):
        self.con.close()

    def fetch(self, sql):
        self.__connect__()
        self.cur.execute(sql)
        result = self.cur.fetchall()
        self.__disconnect__()
        return result

    def execute(self, sql):
        self.__connect__()
        self.cur.execute(sql)

        self.__disconnect__()

    def execute_commit(self, sql):
        self.__connect__()
        self.cur.execute(sql)
        self.con.commit()
        self.__disconnect__()

    def selection_command(self, selection, FROM, WHERE, WHERE_val):

        if selection == "*":
            sql = "SELECT {} FROM `{}` WHERE `{}` = '{}'".format(selection, FROM, WHERE, WHERE_val)
            return self.fetch(sql)
        
        sql = "SELECT `{}` FROM `{}` WHERE `{}` = '{}'".format(selection, FROM, WHERE, WHERE_val)
        return self.fetch(sql)

    def registration(self,nickname, email, password, is_activated, activation_link):
        try:


            sql = "INSERT INTO `users` (`id`, `nickname`, `email`, `password`, `is_activated`, `activation_link`) VALUES (NULL, '{}', '{}', '{}', {}, '{}')".format(nickname ,email, password, is_activated, activation_link)
           
            self.execute_commit(sql)
        except Exception as e:
                print(e)

    def token(self, sql):
        try:
            sql = sql
            self.execute_commit(sql)

        except Exception as e:
            print(e)


