# welm_social

```welm.io``` is a social network where you can share thoughts about specific tickers of companies, monitor their prices, add them to your portfolio

development stack: fask, mysql, docker, react-typescript (standard SPA using CSR), statemanager: mobx

## run local backend

```docker-compose build``` build image with mysql&phpmyadmin <br/>

```docker-compose up -d``` up mysql&phpmyadmin <br/>

```cd python``` <br/>

```docker build .``` build python image <br/>

```docker run -it -p 80:80 --mount type=bind,source="$(pwd)",target=/mounted <image_name> bash``` run an image with mounted dev folder&open a container in your terminal <br/>

add a container to your docker-compose network <br/>
