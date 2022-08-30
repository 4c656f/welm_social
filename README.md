# welm_social

## Setup db

build docker image ```docker-compose build```

run docker container ```docker-compose up -d```

open ```localhost:9000```

default user&password ```root```

create db ```users```

add import from folder ```mysql_import```
 
 
 
## configure env file inside python folder: 

```
PORT=
DB_HOST=
DB_USER=
DB_PASSWORD=
JWT_ACCESS_TOKEN=
JWT_REFRESH_TOKEN=
EMAIL_USER=
EMAIL_PASSWORD=
FRONT_DOMAIN= #for subdomain coockies
BACK_DOMAIN= #for email confirm
```
