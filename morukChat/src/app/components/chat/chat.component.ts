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
  messageInput = '';
  userList: any;
  channels = [
    {
      name: 'General',
      selected: true,
      history: []
    },
    {
      name: 'Default',
      selected: false,
      history: []
    }
  ];
  currentChannelName = this.channels[0].name;

  constructor(private http: HttpClient, private loginService: LoginService, private userService: UserService, private changeDetector: ChangeDetectorRef) {

    this.http.get('http://localhost:3000/users').subscribe(_list => {
      this.userList = _list;
      this.allUsersAsChannel(_list);
    });
    this.chatHistory = [];
  }

  ngOnInit(): void {

    // // Websocket mit username und channel registrieren...
    let data = {
      owner: this.user.name,
      participant: this.currentChannelName,
    };

    socket.emit('connect-chat', data);
    // Hier wird die Nachricht ankommen...
    socket.on('new-message', (data) => {
      // Das hier dann irgendwie in die liste/fenster pushen...
      console.log('onInit', data);

      this.addToHistory(data).subscribe(_hist => {
        // console.log(_hist);
        this.messageInput = '';
        this.changeDetector.detectChanges();
      });
    })
  }

  allUsersAsChannel(list) {
    for (const user of list) {
      var tempChannel = {
          name: user.username,
          selected: false,
          history: []
        };
      this.channels.push(tempChannel);
    }
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

// debugger;

    let data = {
      owner: this.user.name,
      participant: this.currentChannelName,
      message: message
    };

    // socket.emit('connect-chat', data);
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

  showAllUsers() {
    // this.http.get('http://localhost:3000/users').subscribe(_users => {
    //   this.userList = _users;
    //   console.log(_users)
    // });

    console.log(this.userList);
  }


}

