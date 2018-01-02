import {
  ChangeDetectorRef,
  Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from "../../classes/user";
import {LoginService} from "../../services/login.service";
import {UserService} from "../../services/user.service";
import {WebsocketService} from "../../services/websocket.service";
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

  socket;

  chatList: any;
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

  constructor(private http: HttpClient, private _websocketService: WebsocketService, private loginService: LoginService, private userService: UserService, private changeDetector: ChangeDetectorRef) {


    this.http.get('http://localhost:3000/users').subscribe(_list => {
      this.userList = _list;
      this.allUsersAsChannel(_list);
    });
    this.chatHistory = [];

  }


  ngOnInit(): void {

    // Get chatlist of user
    this.http.get('http://localhost:3000/chats/' + this.user.name).subscribe(_list => {
      this.chatList = _list;
    });

    // Initialize the websocket
    this.initSocket();
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


  /**
   * Initalize Socket connection to backend
   */
  initSocket() {

    let data = {
      owner: this.user.name,
      participant: this.currentChannelName,
    };

    this._websocketService.emit('connect-chat', data);


    // Listener for new messages...
    this._websocketService.on('new-message', (data) => {
      console.log("New Message received for " + this.currentChannelName, data);


      this.addToHistory(data).subscribe(_hist => {
        this.messageInput = '';
        this.changeDetector.detectChanges();
      });
    });

  }


  /**
   * Send message
   * @param message
   */
  sendMessage(message): void {

    let data = {
      owner: this.user.name,
      participant: this.currentChannelName,
      message: message
    };

    this._websocketService.emit('new-message', data);
  }


  updateChat(name) {

    let self = this;

    const tempChannel = this.channels.find(channel => channel.selected === true);
    tempChannel.history = this.chatHistory;
    for (const channel of this.channels) {
      if (channel.name === name) {
        channel.selected = true;
        this.chatHistory = channel.history;
        this.currentChannelName = channel.name;


        this._websocketService.clean(function () {
          self._websocketService.init(function () {
            self.initSocket();
          });
        });

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


  /**
   * Small function to decide the style for the message
   * @param sender
   * @returns {string}
   */
  getStyle(sender: any) {
    if (sender == this.user.name) {
      return 'replies';
    } else {
      return 'sent';
    }
  }


}

