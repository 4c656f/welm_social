import  sys, flask
import datetime

sys.path.append("..")
from mysql_methods.mysql import DB
from slugify import slugify


class PostService:

    def __init__(self):
        self.db = DB()


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
            text_with_tags = ""
            for i in text:

                if i.startswith("$"):

                    sql = f"SELECT * FROM tickers WHERE ticker = '{i[1:]}'"
                    selection = self.db.fetch(sql)
                    if selection:
                        tags.append(i.upper())
                        text_with_tags += f"<div>{i.upper()}</div> "
                else:
                    text_with_tags += f"{i} "

            tags = list(dict.fromkeys(tags))

            last_id = self.db.fetch("SELECT `id` FROM `posts` ORDER BY `id` DESC LIMIT 1")

            if not last_id:
                last_id = 1

            else:
                last_id = int(last_id[0]["id"]) + 1

            post_link = f"{last_id}-{post_link}"

            sql = "INSERT INTO `posts` (`author_nickname`, `author_id`, `content`, `creation_date`, `post_link`) VALUES ('{}', {}, '{}', '{}', '{}')".format(
                author_nickname,
                author_id,
                text_with_tags,
                date,
                post_link

            )

            self.db.execute_commit(sql)
            self.db.execute_commit_many(
                f"INSERT INTO `ticker_tags` (`ticker_tag`, `post_id`) VALUES (%s, {last_id})", tags)

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
                  "(" \
                  "`author_nickname`, " \
                  "`author_id`," \
                  " `post_id`, " \
                  "`content`, " \
                  "`creation_date`) " \
                  "VALUES " \
                  "(" \
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
            select_check = self.db.fetch(
                "SELECT * FROM `posts_likes` WHERE `author_id` = {} AND `post_id` = {}".format(author_id, post_id))
            if select_check:
                sql = f"UPDATE `posts_likes` SET `like_type`='{like}',`creation_date`='{date}'  WHERE `author_id` = '{author_id}' AND `post_id` = '{post_id}'"

                self.db.execute_commit(sql)
                return flask.jsonify(True), 200

            sql = f"INSERT INTO `posts_likes` (`id`, `author_nickname`, `author_id`, `post_id`, `like_type`, `creation_date`) VALUES (NULL, '{author_nickname}', '{author_id}', {post_id}, '{like}', '{date}')"

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
        try:
            if sort == "new":
                sql = f"""
                SELECT posts.*,
                IFNULL(l.count, 0) as likes,
                IFNULL(c.comment_count, 0) as comments,
                {"IFNULL(posts_likes.like_type, 0)" if user else 0} as like_initial,
                {"IFNULL(saved_posts.post_id  ,0)" if user else 0} as is_saved
                FROM posts
                {f'INNER JOIN ticker_tags ON ticker_tags.post_id = posts.id AND ticker_tags.ticker_tag = "${ticker}"' if ticker else ""} 
                LEFT JOIN (
                    SELECT SUM(posts_likes.like_type) as count, posts_likes.post_id FROM posts_likes  GROUP BY posts_likes.post_id)
                    l on l.post_id = posts.id
                LEFT JOIN (
                    SELECT COUNT(*) as comment_count, posts_comments.post_id FROM posts_comments  GROUP BY posts_comments.post_id)
                    c on c. post_id = posts.id
                {f'''
                LEFT JOIN posts_likes on posts_likes.post_id = posts.id AND posts_likes.author_id = {user["user_id"]}
                LEFT JOIN saved_posts on saved_posts.post_id = posts.id AND saved_posts.user_id = {user["user_id"]}
                ''' if user else ""}

                ORDER BY posts.creation_date DESC,posts.id ASC LIMIT {start}, {end};
                """

            elif sort == "popular":
                sql = f"""
                SELECT posts.*,
                IFNULL(l.count, 0) as likes,
                IFNULL(c.comment_count, 0) as comments,
                {"IFNULL(posts_likes.like_type, 0)" if user else 0} as like_initial,
                {"IFNULL(saved_posts.post_id  ,0)" if user else 0} as is_saved
                FROM posts
                {f'INNER JOIN ticker_tags ON ticker_tags.post_id = posts.id AND ticker_tags.ticker_tag = "${ticker}"' if ticker else ""} 
                LEFT JOIN (
                    SELECT SUM(posts_likes.like_type) as count, posts_likes.post_id FROM posts_likes  GROUP BY posts_likes.post_id
                ) l on l.post_id = posts.id
                LEFT JOIN (
                    SELECT COUNT(*) as comment_count, posts_comments.post_id FROM posts_comments  GROUP BY posts_comments.post_id
                ) c on c. post_id = posts.id
                {f'''
                LEFT JOIN posts_likes on posts_likes.post_id = posts.id AND posts_likes.author_id = {user["user_id"]}
                LEFT JOIN saved_posts on saved_posts.post_id = posts.id AND saved_posts.user_id = {user["user_id"]}
                ''' if user else ""}
                WHERE posts.creation_date >= '{datetime.datetime.now() - datetime.timedelta(interval)}'
                ORDER BY likes DESC,posts.id ASC LIMIT {start}, {end};
                """

            posts = self.db.fetch(sql)

            data_return = []

            for i in posts:
                tags_select = f"SELECT * FROM ticker_tags WHERE ticker_tags.post_id = {i['id']} GROUP BY ticker_tag"

                tags = self.db.fetch(tags_select)
                cur_post = i
                cur_post["tags"] = tags

                data_return.append(cur_post)

        except Exception as e:
            print(e)
            return str(e), 400
        return flask.jsonify(data_return)

    def get_full_post(self, request):
        try:
            data = request.get_json()
            link = data["link"]
            user = data["user"]
        except Exception as e:
            print(e)
            return str(e), 400
        try:
            sql = f"""
                            SELECT posts.*,
                            IFNULL(l.count, 0) as likes,
                            IFNULL(c.comment_count, 0) as comments,
                            {"IFNULL(posts_likes.like_type, 0)" if user else 0} as like_initial,
                            {"IFNULL(saved_posts.post_id  ,0)" if user else 0} as is_saved
                            FROM posts
                            LEFT JOIN (
                                SELECT SUM(posts_likes.like_type) as count, posts_likes.post_id FROM posts_likes  GROUP BY posts_likes.post_id)
                                l on l.post_id = posts.id
                            LEFT JOIN (
                                SELECT COUNT(*) as comment_count, posts_comments.post_id FROM posts_comments  GROUP BY posts_comments.post_id)
                                c on c. post_id = posts.id
                            {f'''
                            LEFT JOIN posts_likes on posts_likes.post_id = posts.id AND posts_likes.author_id = {user["user_id"]}
                            LEFT JOIN saved_posts on saved_posts.post_id = posts.id AND saved_posts.user_id = {user["user_id"]}
                            ''' if user else ""}
                            WHERE posts.post_link = "{link}";
                            """


            posts = self.db.fetch(sql)

            data_return = []

            for i in posts:
                tags_select = f"SELECT * FROM ticker_tags WHERE ticker_tags.post_id = {i['id']} GROUP BY ticker_tag"
                comments_select = f"SELECT * FROM posts_comments WHERE posts_comments.post_id = {i['id']} ORDER BY posts_comments.creation_date DESC,posts_comments.id ASC"
                tags = self.db.fetch(tags_select)
                comments = self.db.fetch(comments_select)
                cur_post = i
                cur_post["tags"] = tags
                cur_post["comments_full"] = comments
                data_return.append(cur_post)

        except Exception as e:
            print(e)
            return str(e), 400
        return flask.jsonify(data_return)

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
            self.db.execute_commit(f"DELETE FROM `saved_posts` WHERE user_id = {user_id} AND post_id = {post_id}")
            return flask.jsonify(True), 200
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
        IFNULL(li.like_type, 0) as like_initial,
        1 as is_saved
        FROM posts
        INNER JOIN saved_posts ON saved_posts.post_id = posts.id AND saved_posts.user_id = {user_id} 
        LEFT JOIN ( SELECT SUM(posts_likes.like_type) as count, posts_likes.post_id FROM posts_likes GROUP BY posts_likes.post_id ) l on l.post_id = posts.id 
        LEFT JOIN ( SELECT COUNT(*) as comment_count, posts_comments.post_id FROM posts_comments GROUP BY posts_comments.post_id ) c on c. post_id = posts.id
        LEFT JOIN ( SELECT posts_likes.author_id, posts_likes.post_id,posts_likes.like_type FROM posts_likes)
        li on li.post_id = posts.id AND li.author_id = {user_id}
        ORDER BY saved_posts.save_date DESC,posts.id ASC;"""



        posts = self.db.fetch(sql)

        data_return = []

        for i in posts:
            tags_select = f"SELECT * FROM ticker_tags WHERE ticker_tags.post_id = {i['id']} GROUP BY ticker_tag"

            tags = self.db.fetch(tags_select)
            cur_post = i
            cur_post["tags"] = tags

            data_return.append(cur_post)
        return flask.jsonify(data_return), 200


