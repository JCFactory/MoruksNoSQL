import {Injectable} from '@angular/core';
import * as io from "socket.io-client";

@Injectable()
export class WebsocketService {

  socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io('http://localhost:3000/chatmessage');

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
    if (this.socket) {
      this.socket.emit(eventName, data);
    }
  };


  removeListener(eventname: any) {
    if (this.socket) {
      this.socket.removeListener(eventname);
    }
  }


}
