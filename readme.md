```
      MMMM   MMMM         OOOOOO    RRRRRR      UU    UU   KK    KK  SSSSSS
     MM MM  MM MM       OO    OO   RR    RR    UU    UU   KK   KK   SS
    MM  MM MM  MM      OO    OO   RR     RR   UU    UU   KK  KK     SS  
   MM   MMMM   MM     OO    OO   RR  RRRR    UU    UU   KK KK        SSSS
  MM    MMMM   MM    OO    OO   RR  RR      UU    UU   KK KK            SS
 MM            MM   OO    OO   RR    RR    UU    UU   KK   KK          SS
MM             MM   OOOOOO    RR       RR   UUUUU    KK       KK  SSSSSS 
```

## Backend

### Pfad zu MongoDB Daten:
```./mongo-data/db```

### MongoDB-Server starten:
Im MongoDB bin-Verzeichnis (z.B. /MongoDB/Server/3.4/bin) eingeben:<br>
```mongod --dbpath (Pfad zum Projekt MoruksNoSQL)\mongo_data\db```

### rabbitMQ-Server starten:
In (pfad zu rabbitMQ-Installation)/RabbitMQ Server/rabbitmq_server-3.6.14/sbin
ausführen: ```rabbitmq-server```

### Für Node-Server:<br>
Node installieren: https://nodejs.org/en/

### Packete installieren <br>
MongoDB: ```npm install mongodb --save```<br>
rabbitMQ: ```npm install amqplib```<br>
Nodemon: ```npm  install nodemon```<br>


### Installation

```cd Pfad zum Projekt MoruksNoSQL/Chatssystem-Backend && npm install ```

### Starten
Backend ist nach Start unter Port: 3000 erreichbar z. B. http://localhost:3000 <br>
```cd Pfad zum Projekt MoruksNoSQL/Chatssystem-Backend && npm start ```


### Hinweis
Message an Backend senden:<br>
```**/MoruksNoSQL/node_modules new_task.js <arg> ```<br>
Argument wird an Server gesendet


## Frontend

### Installation
```**/MoruksNoSQL/morukChat/npm install``` ausführen

### Starten
```**/MoruksNoSQL/morukChat/ng serve```
