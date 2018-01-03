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



### Default und General (Gruppen Chat)
In der app.js werden die Gruppen Chats angelegt => Exchange, Queues und die Collections z. B. "inanbayram-Default"

## Mögliche Requests

### /history

#### GET - History abfragen

```
http://localhost:3000/history/:username/:chatname
```
##### Beispiel:
Eingeloggte Benutzer "inanbayram" ruft die Historie von der Privatchat mit "steffen" ab<br>
```
http://localhost:3000/history/inanbayram/steffen
```

<hr>

### /chats

#### GET - Chatliste von User abfragen

```
http://localhost:3000/history/:username/
```

##### Beispiel:
Rufe die Chatliste von user "inanbayram". Hier werden alle aktiven Chats aufgelistet (Gruppen und Private)<br>
```
http://localhost:3000/chats/inanbayram
```
<hr>

#### POST - Neue Chat erstellen (Privat)

```
http://localhost:3000/chats
```

#### Inhalt der Body
Angemeldete Benutzer "inanbayram" erstellt eine Chat mit "steffen"<br>
```
{
  "owner": "inanbayram",
  "participant": "steffen"
}
```
<hr>

### /users

#### GET - Userliste abfragen
```
http://localhost:3000/users
```

<hr>

#### GET - Einzelne User abfragen
```
http://localhost:3000/users/:username
```

##### Beispiel:
Informationen von Benutzer "inanbayram" abfragen

```
http://localhost:3000/users/inan
```

<hr>

#### POST - Login
```
http://localhost:3000/users/login
```

##### Inhalt der Body
```
{
  username: "inanbayram",
  password: "SHA256 gehashte Password"
}
```

<hr>

#### POST - User erstellen

```
http://localhost:3000/users
```

##### Inhalt der Body
```
{
  "firstname": "Inan",
  "lastname": "Bayram",
  "username": "inanbayram"
  "password": "12ahsdk18asdjkas"
}
```

<hr>

## Besonderheiten für Mac-User

### Starten von RabbitMQ-Server:
--> in das Installations-Verzeichnis von RabbitMQ gehen
``` cd rabbitmq-3.6.14 ```
Befehl für das Starten des RabbitMQ-Servers:
```brew services start rabbitmq```

### Hinweise

Wenn RabbitMQ oder MongoDB mit Homebrew installiert wurden
(```brew install rabbitmq```/ ```brew install mongodb```)
dann liegen die Installationsdateien im Homebrew-Verzeichnis
als tar.gz - Dateien. Um diese zu entpacken, hilft der folgende Befehl:

``` gunzip -c rabbitmq-3.6.14.tar.xz | tar xopf - ```
Bzw.: ``` gunzip -c mongodb-3.4.10.high_sierra.bottle.tar.gz | tar xopf - ```
