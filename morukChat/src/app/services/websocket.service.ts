import {Injectable} from '@angular/core';
import * as io from "socket.io-client";

@Injectable()
export class WebsocketService {

  socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io('http://localhost:3000/chatmessage');

  }

  clean(callback: any) {
    this.socket.close();
    callback();
  }

  init(callback: any) {

    this.socket = io('http://localhost:3000/chatmessage');
    callback();
  }

  on(eventName: any, callback: any) {
    if (this.socket) {
      this.socket.on(eventName, function (data: any) {
        console.log(data);
        callback(data);
      });
    }
  };


  emit(eventName: any, data: any) {
    console.log(this.socket);
    if (this.socket) {
      this.socket.emit(eventName, data);
    }
  };


  removeListener(eventname: any) {
    if (this.socket) {
      this.socket.removeListener(eventname);
    }
  }


  disconnect() {
    if (this.socket) {
      console.log('Disconnect');
      this.socket.disconnect();
    }
  }


}
