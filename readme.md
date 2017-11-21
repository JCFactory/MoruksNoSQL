``` 
     MMMM   MMMM      OOOOOOO    RRRRRR      UU    UU   KK    KK  SSSSSS
    MM MM  MM MM     OO    OO   RR    RR    UU    UU   KK   KK   SS
   MM  MM MM  MM    OO    OO   RR     RR   UU    UU   KK  KK      SSSS  
  MM   MMMM   MM   OO    OO   RR  RRRR    UU    UU   KK KK           SS
 MM           MM  OO    OO   RR   RR     UU    UU   KK   KK         SS 
MM            MM  OOOOOOO   RR      RR    UUUUU    KK      KK  SSSSSS
```


Pfad zu MongoDB Daten:
./mongo-data/db

MongoDB-Server starten:
Im MongoDB bin-Verzeichnis (z.B. /MongoDB/Server/3.4/bin) eingeben: 
mongod --dbpath (Pfad zum Projekt MoruksNoSQL)\mongo_data\db

rabbitMQ-Server starten:
In (pfad zu rabbitMQ-Installation)/RabbitMQ Server/rabbitmq_server-3.6.14/sbin
ausführen: rabbitmq-server

Für Node-Server:
Node installieren: https://nodejs.org/en/

Packete installieren 
MongoDB: npm install mongodb --save
rabbitMQ: npm install amqplib
Nodemon: npm  install nodemon

Node-Server starten:
(Pfad zum Projekt  MoruksNoSQL)/nodemon server.js
