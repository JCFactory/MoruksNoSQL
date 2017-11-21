```
     MMMM   MMMM      OOOOOOO    RRRRRR      UU    UU   KK    KK  SSSSSS
    MM MM  MM MM     OO    OO   RR    RR    UU    UU   KK   KK   SS
   MM  MM MM  MM    OO    OO   RR     RR   UU    UU   KK  KK      SSSS  
  MM   MMMM   MM   OO    OO   RR  RRRR    UU    UU   KK KK           SS
 MM           MM  OO    OO   RR   RR     UU    UU   KK   KK         SS
MM            MM  OOOOOOO   RR      RR    UUUUU    KK      KK  SSSSSS
```


### Pfad zu MongoDB Daten:
./mongo-data/db

### MongoDB-Server starten:
Im MongoDB bin-Verzeichnis (z.B. /MongoDB/Server/3.4/bin) eingeben:<br>
mongod --dbpath (Pfad zum Projekt MoruksNoSQL)\mongo_data\db

### rabbitMQ-Server starten:<br>
In (pfad zu rabbitMQ-Installation)/RabbitMQ Server/rabbitmq_server-3.6.14/sbin<br>
ausführen: rabbitmq-server

### Für Node-Server:<br>
Node installieren: https://nodejs.org/en/

### Packete installieren <br>
MongoDB: npm install mongodb --save<br>
rabbitMQ: npm install amqplib<br>
Nodemon: npm  install nodemon<br>


### Backend

#### Installation

```cd Pfad zum Projekt MoruksNoSQL/Chatsystem-Backend && npm install ```

#### Starten

Backend ist nach Start unter Port: 3000 erreichbar z. B. http://localhost:3000
```cd Pfad zum Projekt MoruksNoSQL/Chatsystem-Backend && npm start ```


#### Alte Version
Node-Server starten:<br>

(Pfad zum Projekt  MoruksNoSQL)/nodemon server.js
