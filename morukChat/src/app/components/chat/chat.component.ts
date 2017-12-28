import {
  ChangeDetectorRef,
  Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from "../../classes/user";
import {LoginService} from "../../services/login.service";
import {UserService} from "../../services/user.service";
import {templateVisitAll} from "@angular/compiler";
import {Observable} from "rxjs/Observable";


const INITIAL_CHANNEL = 'ThaerTube';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {

  @ViewChild('messageContainer') messageContainer: ElementRef;
  @Input() user: User;
  @Output() openUserList = new EventEmitter();

  chatHistory: any;
  currentChannelName = INITIAL_CHANNEL;
  messageInput = '';
  channels = [
    {
      name: INITIAL_CHANNEL,
      selected: true,
      history: []
    },
    {
      name: 'General',
      selected: false,
      history: []
    },
    {
      name: 'Default',
      selected: false,
      history: []
    }
  ];

  constructor(private http: HttpClient, private loginService: LoginService, private userService: UserService, private changeDetector: ChangeDetectorRef) {

    // this.allUsers = this.http.get('http://localhost:3000/users');
    this.chatHistory = [];
  }

  ngOnInit(): void {

    // Websocket mit username und channel registrieren...
    socket.emit("connect-chat", { username: this.user.name});

    // Hier wird die Nachricht ankommen...
    socket.on('new-message', (data) => {
      // Das hier dann irgendwie in die liste/fenster pushen...
      console.log(data);
      this.addToHistory(data).subscribe(_hist => {
        // console.log(_hist);
        this.messageInput = '';
        this.changeDetector.detectChanges();

      });
    })
  }


  addToHistory(data): Observable<any> {
    return Observable.create(obs => {
      this.chatHistory.push(data);
      obs.next(this.chatHistory);
    });
  }

  setChannelSelected(event: string): void {
    for (let channel of this.channels) {
      channel.selected = channel.name === event;
    }
  }

  sendMessage(message): void {

    var data = {
      username: this.user.name,
      channelname: 'channelname',
      message: message
    };

    // console.log('socket:', socket);

    socket.emit('new-message', data);
  }

  updateChat(name) {
    const tempChannel = this.channels.find(channel => channel.selected === true);
    tempChannel.history = this.chatHistory;
    for (const channel of this.channels) {
      if (channel.name === name) {
        channel.selected = true;
        this.chatHistory = channel.history;
        this.currentChannelName = channel.name;
      } else {
        channel.selected = false;
      }
    }
  }

}

