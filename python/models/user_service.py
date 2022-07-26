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
            resp = {"tokens": tokens, "user": {"user_id": data["id"], "user_nickname": data["nickname"], "email": data["email"],
                                               "is_activated": data["is_activated"]}}
            res = flask.make_response(flask.jsonify(resp))

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
            content = data["post"]["content"]


            author_id = user["user_id"]

            author_nickname = user["user_nickname"]
            date = datetime.datetime.now()

            text = content.split(" ")
            link_text = f"{text[0:3]}"
            post_link = slugify(link_text)
            tags = []

            for i in text:
                if i.startswith("$"):
                    tags.append(i.upper())

            tags = list(dict.fromkeys(tags))

            last_id = self.db.fetch("SELECT `id` FROM `posts` ORDER BY `id` DESC LIMIT 1")

            if not last_id:
                last_id = 1

            else:
                last_id = int(last_id[0]["id"]) + 1






            post_link = f"{last_id}-{post_link}"
            print(last_id)
            sql = "INSERT INTO `posts` (`id`, `author_nickname`, `author_id`, `content`, `creation_date`, `post_link`) VALUES (NULL, '{}', {}, '{}', '{}', '{}')".format(
                author_nickname,
                author_id,
                content,
                date,
                post_link


            )
            self.db.execute_commit(sql)
            for i in tags:
                selection = self.db.fetch(f"SELECT `id` FROM `ticker_tags` WHERE `ticker_tag` = '{i}' AND `post_id` = {last_id}")
                if not selection:
                    self.db.execute_commit(
                        f"INSERT INTO `ticker_tags`(`id`, `ticker_tag`, `post_id`) VALUES (NULL,'{i}', {last_id})")

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
            data = request.get_json()["data"]

            user = data["user"]
            author_id = user["user_id"]
            author_nickname = user["user_nickname"]
            like = data["like"]["like_type"]
            post_id = data["like"]["post_id"]
            date = datetime.datetime.now()
            select_check = self.db.fetch("SELECT * FROM `posts_likes` WHERE `author_id` = {} AND `post_id` = {}".format(author_id, post_id))
            if select_check:
                sql = f"UPDATE `posts_likes` SET `like_type`='{like}',`creation_date`='{date}'  WHERE `author_id` = '{author_id}' AND `post_id` = '{post_id}'"
                print(sql)
                self.db.execute_commit(sql)
                return flask.jsonify(True), 200



            sql = f"INSERT INTO `posts_likes` (`id`, `author_nickname`, `author_id`, `post_id`, `like_type`, `creation_date`) VALUES (NULL, '{author_nickname}', '{author_id}', {post_id}, '{like}', '{date}')"
            print(sql)
            self.db.execute_commit(sql)

            return flask.jsonify(True), 200
        except Exception as e:
            print(e)
            return str(e), 400

    def get_posts(self, request):
        try:
            data = request.get_json()
            start = data["start"]
            end = data["end"]
            sort = data["sort"]
            user = data["user"]
            ticker = data["ticker"]
            if sort == "popular":
                interval = data["interval"]
        except Exception as e:
            print(e)
            return str(e), 400

        if sort == "new":
            sql = f"""
            SELECT posts.*,
            IFNULL(l.count, 0) as likes,
            IFNULL(c.comment_count, 0) as comments,
            {"IFNULL(li.like_type, 0)" if user else 0} as like_initial
            FROM posts
            {f'INNER JOIN ticker_tags ON ticker_tags.post_id = posts.id AND ticker_tags.ticker_tag = "${ticker}"' if ticker else ""} 
            LEFT JOIN (
                SELECT SUM(posts_likes.like_type) as count, posts_likes.post_id FROM posts_likes  GROUP BY posts_likes.post_id)
                l on l.post_id = posts.id
            LEFT JOIN (
                SELECT COUNT(*) as comment_count, posts_comments.post_id FROM posts_comments  GROUP BY posts_comments.post_id)
                c on c. post_id = posts.id
            {f'''LEFT JOIN (
                SELECT posts_likes.author_id, posts_likes.post_id,posts_likes.like_type FROM posts_likes)
                li on li.post_id = posts.id AND li.author_id = {user["user_id"]}''' if user else ""}
            ORDER BY posts.creation_date DESC LIMIT {start}, {end};
            """

        elif sort == "popular":
            sql = f"""
            SELECT posts.*,
            IFNULL(l.count, 0) as likes,
            IFNULL(c.comment_count, 0) as comments,
            {"IFNULL(li.like_type, 0)" if user else 0} as like_initial
            FROM posts
            {f'INNER JOIN ticker_tags ON ticker_tags.post_id = posts.id AND ticker_tags.ticker_tag = "${ticker}"' if ticker else ""} 
            LEFT JOIN (
                SELECT SUM(posts_likes.like_type) as count, posts_likes.post_id FROM posts_likes  GROUP BY posts_likes.post_id
            ) l on l.post_id = posts.id
            LEFT JOIN (
                SELECT COUNT(*) as comment_count, posts_comments.post_id FROM posts_comments  GROUP BY posts_comments.post_id
            ) c on c. post_id = posts.id
            {f'''LEFT JOIN (
                SELECT posts_likes.author_id, posts_likes.post_id,posts_likes.like_type FROM posts_likes)
                li on li.post_id = posts.id AND li.author_id = {user["user_id"]}''' if user else ""}
            WHERE posts.creation_date >= '{datetime.datetime.now() - datetime.timedelta(interval)}'
            ORDER BY likes DESC LIMIT {start}, {end};
            """
        print (sql)
        posts = self.db.fetch(sql)

        return flask.jsonify(posts)

    def save_post(self, request):
        try:
            data = request.get_json()
            user_id = data["user"]["user_id"]
            post_id = data["post_id"]
            date = datetime.datetime.now()

        except Exception as e:
            print(e)
            return str(e), 400

        sql = f"SELECT * FROM `saved_posts` WHERE user_id = {user_id} AND post_id = {post_id}"
        if self.db.fetch(sql):
            return "already", 200
        try:
            add_save = f"INSERT INTO `saved_posts`(`id`, `user_id`, `post_id`, `save_date`) VALUES (NULL, {user_id}, {post_id}, '{date}')"
            self.db.execute_commit(add_save)
            return flask.jsonify(True), 200
        except Exception as e:
            print(e)
            return str(e), 400


    def get_save_posts(self, request):
        try:
            data = request.get_json()
            user_id = data["user"]["user_id"]


        except Exception as e:
            print(e)
            return str(e), 400

        sql = f"""SELECT posts.*,
        IFNULL(l.count, 0) as likes,
        IFNULL(c.comment_count, 0) as comments,
        IFNULL(li.like_type, 0) as like_init
        FROM posts
        INNER JOIN saved_posts ON saved_posts.post_id = posts.id AND saved_posts.user_id = {user_id} 
        LEFT JOIN ( SELECT SUM(posts_likes.like_type) as count, posts_likes.post_id FROM posts_likes GROUP BY posts_likes.post_id ) l on l.post_id = posts.id 
        LEFT JOIN ( SELECT COUNT(*) as comment_count, posts_comments.post_id FROM posts_comments GROUP BY posts_comments.post_id ) c on c. post_id = posts.id
        LEFT JOIN ( SELECT posts_likes.author_id, posts_likes.post_id,posts_likes.like_type FROM posts_likes)
        li on li.post_id = posts.id AND li.author_id = {user_id}
        ORDER BY saved_posts.save_date DESC;"""

        posts = self.db.fetch(sql)

        return flask.jsonify(posts), 200


    def get_posts_by_ticker(self, request):
        try:
            data = request.get_json()
            ticker = "$" + data["ticker"]
            start = data["start"]
            end = data["end"]
            sort = data["sort"]
            if sort == "popular":
                interval = int(data["interval"])
        except Exception as e:
            print(e)
            return str(e), 400

        print(ticker)



        if sort == "new":
            sql = f"""SELECT posts.*,
            IFNULL(l.count, 0) as likes,
            IFNULL(c.comment_count, 0) as comments 
            FROM posts INNER JOIN ticker_tags ON ticker_tags.post_id = posts.id AND ticker_tags.ticker_tag = '{ticker}' 
            LEFT JOIN ( SELECT SUM(posts_likes.like_type) as count, posts_likes.post_id FROM posts_likes GROUP BY posts_likes.post_id ) l on l.post_id = posts.id 
            LEFT JOIN ( SELECT COUNT(*) as comment_count, posts_comments.post_id FROM posts_comments GROUP BY posts_comments.post_id ) c on c. post_id = posts.id 
            ORDER BY posts.creation_date DESC LIMIT {start}, {end};"""
        elif sort == "popular":
            sql = f"""SELECT posts.*, 
            IFNULL(l.count, 0) as likes,
            IFNULL(c.comment_count, 0) as comments 
            FROM posts INNER JOIN ticker_tags ON ticker_tags.post_id = posts.id AND ticker_tags.ticker_tag = '{ticker}'
            AND DATE(posts.creation_date) >= '{datetime.datetime.now() - datetime.timedelta(interval)}'
            LEFT JOIN ( SELECT SUM(posts_likes.like_type) as count, posts_likes.post_id FROM posts_likes GROUP BY posts_likes.post_id ) l on l.post_id = posts.id 
            LEFT JOIN ( SELECT COUNT(*) as comment_count, posts_comments.post_id FROM posts_comments GROUP BY posts_comments.post_id ) c on c. post_id = posts.id 
            ORDER BY likes DESC LIMIT {start}, {end};"""

        print(sql)
        posts = self.db.fetch(sql)

        return flask.jsonify(posts), 200

    def get_check_nickname(self, request):
        try:
            nickname = request.args.get('nickname')
            email = request.args.get('email')
            print(email)
        except Exception as e:
            print(e)
            return str(e), 400
        sql = f"SELECT * FROM `users` WHERE users.nickname = '{nickname}' OR users.email = '{email}'"
        if self.db.fetch(sql):
            return flask.jsonify(False), 200
        return flask.jsonify(True), 200