FROM python:3.8-buster


WORKDIR /opt/oracle



RUN apt-get update && apt-get install -y libaio1 wget unzip \
    && wget https://download.oracle.com/otn_software/linux/instantclient/1913000/instantclient-basic-linux.x64-19.13.0.0.0dbru.zip \
    && unzip instantclient-basic-linux.x64-19.13.0.0.0dbru.zip \
    && rm -f instantclient-basic-linux.x64-19.13.0.0.0dbru.zip \
    && cd /opt/oracle/instantclient* \
    && rm -f *jdbc* *occi* *mysql* *README *jar uidrvci genezi adrci \
    && echo /opt/oracle/instantclient* > /etc/ld.so.conf.d/oracle-instantclient.conf \
    && ldconfig

RUN apt-get install -y libev-dev
RUN apt-get install -y build-essential

WORKDIR /app
COPY . .
EXPOSE 80

RUN pip3 install -r requirements.txt

CMD ["python", "main.py"]