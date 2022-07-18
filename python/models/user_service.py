import bcrypt, uuid, sys, flask
from .mail_service import send_activation_mail
from .token_service import *
import datetime
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


        hash_password = bcrypt.hashpw(password.encode('utf-8') , bcrypt.gensalt()).decode('utf-8')



        activation_link = uuid.uuid4()
        user_link = slugify(nickname)
        sql = "INSERT INTO `users` (`id`, `nickname`, `email`, `password`, `is_activated`, `activation_link`, `user_link`) VALUES (NULL, '{}', '{}', '{}', {}, '{}', '{}')".format(nickname ,email, hash_password, int(False), activation_link, user_link)

        self.db.execute_commit(sql)

        send_activation_mail(email, activation_link)



        return flask.jsonify(True)
        
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
        resp_data = flask.jsonify({"tokens": tokens, "user": {"user_id": user_id, "user_nickname": user_nickname, "email": email, "is_activated": is_activated}})
        res = flask.make_response(resp_data)

        res.set_cookie("refresh_token", value=tokens["refresh_token"], httponly=True, expires= datetime.datetime.utcnow() + datetime.timedelta(days=30))

        return res

    def activation(self, link):
        print(link)
        res = self.db.selection_command("*", "users", "activation_link", link)

        if not res:
            return "bad url", 404

        sql = "UPDATE users SET is_activated ='{}' WHERE activation_link = '{}'".format(1,link)
        self.db.token(sql)
        sql = "UPDATE users SET activation_link = NULL WHERE activation_link = '{}'".format(link)
        self.db.token(sql)


        return flask.redirect("http://www.google.com", code=302, Response=None)

    def refresh(self, request):



        try:


            refresh_token = request.cookies.get("refresh_token")



            if not self.db.selection_command("*", "tokens", "refresh_token", refresh_token):
                return  "invalid refresh_token", 401



            user_id = validate_refresh_token(refresh_token)["payload"]["user_id"]

            data = self.db.selection_command("*", "users", "id", user_id)[0]

            payload = {'user_id': data["id"],
                       'email': data["email"],
                       'is_activated': data["is_activated"]
                       }



            tokens = generate_tokens(payload)

            res = flask.make_response(flask.jsonify(tokens))

            res.set_cookie("refresh_token", value=tokens["refresh_token"], httponly=True, expires= datetime.datetime.utcnow() + datetime.timedelta(days=30))

            return res, 200




        except Exception as e:
            print(e)
            return "invalid refresh_token", 401



    def logout(self, request):


        try:


            refresh_token = request.cookies.get("refresh_token")





            res = flask.make_response("")

            res.set_cookie("refresh_token", "", httponly=True)

            delete_token(refresh_token)

            return res, 200




        except Exception as e:
            print(e)
            return "invalid refresh_token", 401

    def add_post(self, request):
        try:
            data = request.get_json()

            user = data["user"]
            title = data["post"]["title"]
            content = data["post"]["content"]


            author_id = user["user_id"]

            author_nickname = user["user_nickname"]
            date = datetime.datetime.now()
            post_link = slugify(title)

            sql = "INSERT INTO `posts` (`id`, `title`, `author_nickname`, `author_id`, `content`, `creation_date`, `post_link`) VALUES (NULL, '{}', '{}', {}, '{}', '{}', '{}')".format(
                title,
                author_nickname,
                author_id,
                content,
                date,
                post_link


            )
            self.db.execute_commit(sql)

            return flask.jsonify(True), 200
        except Exception as e:
            print(e)
            return str(e), 400
    def add_comment(self, request):
        try:
            data = request.get_json()

            user = data["user"]
            author_id = user["user_id"]
            author_nickname = user["user_nickname"]
            content = data["comment"]["content"]
            post_id = data["comment"]["post_id"]
            date = datetime.datetime.now()
            sql = "INSERT INTO `posts_comments` " \
                  "(`id`, " \
                  "`author_nickname`, " \
                  "`author_id`," \
                  " `post_id`, " \
                  "`content`, " \
                  "`creation_date`) " \
                  "VALUES " \
                  "(NULL, " \
                  "'{}', '{}', {}, '{}', '{}')".format(
                author_nickname,
                author_id,
                post_id,
                content,
                date)
            self.db.execute_commit(sql)

            return flask.jsonify(True), 200
        except Exception as e:
            print(e)
            return str(e), 400


    def like(self, request):
        try:
            data = request.get_json()
            user = data["user"]
            author_id = user["user_id"]
            author_nickname = user["user_nickname"]
            like = data["like"]["like_type"]
            post_id = data["like"]["post_id"]

            select_check = self.db.fetch("SELECT * FROM `posts_likes` WHERE `author_id` = {} AND `post_id` = {}".format(author_id, post_id))
            if select_check:
                if select_check[0]["like_type"] == like:
                    self.db.execute_commit("DELETE FROM `posts_likes` WHERE `author_id` = '{}' AND `post_id` = '{}'".format(author_id, post_id))
                    return flask.jsonify(True), 200
                self.db.execute_commit(
                    "UPDATE `posts_likes` SET `like_type` = {}  WHERE `author_id` = '{}' AND `post_id` = '{}'".format(like, author_id, post_id))
                return flask.jsonify(True), 200


            sql = "INSERT INTO `posts_likes` (`id`, `author_nickname`, `author_id`, `post_id`, `like_type`) VALUES (NULL, '{}', '{}', {}, '{}')".format(author_nickname,
                                                                                                                                                         author_id,post_id, like)
            self.db.execute_commit(sql)

            return flask.jsonify(True), 200
        except Exception as e:
            print(e)
            return str(e), 400

    def get_posts(self, request):
        data = request.get_json()
        start = data["start"]
        end = data["end"]
        sort = data["sort"]
        posts = self.db.fetch("SELECT * FROM `posts` ORDER BY `id` DESC LIMIT {}, {};".format(start, end))
        resp_body = []
        for i in posts:

            i["comments"] = self.db.fetch("SELECT"
                                          " `content`,"
                                          " `author_id`,"
                                          " `author_nickname`,"
                                          " `id`"
                                          " FROM `posts_comments` "
                                          "WHERE `post_id` = {} ORDER BY `id` DESC".format(i["id"]))
            i["likes"] = self.db.fetch(
                "SELECT `id`,"
                " `like_type`,"
                " `author_nickname`,"
                " `author_id`"
                " FROM `posts_likes` WHERE `post_id` = {} ORDER BY `id` DESC".format(i["id"]))
            resp_body.append(i)

        return flask.jsonify(resp_body)



