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

  history: any;
  currentChannel = INITIAL_CHANNEL;
  messageInput = '';
  channels = [
    {
      name: INITIAL_CHANNEL,
      selected: true
    },
    {
      name: 'General',
      selected: false
    },
    {
      name: 'Default',
      selected: false
    }
  ];

  constructor(private http: HttpClient, private loginService: LoginService, private userService: UserService, private changeDetector: ChangeDetectorRef) {

    // this.allUsers = this.http.get('http://localhost:3000/users');
    this.history = [];
  }

  ngOnInit(): void {
    // this.updateChat(INITIAL_CHANNEL);

    // Websocket mit username und channel registrieren...
    socket.emit("connect-chat", { username: this.user.name});

    // Hier wird die Nachricht ankommen...
    socket.on('new-message', (data) => {
      // Das hier dann irgendwie in die liste/fenster pushen...
      console.log(data);
      this.addToHistory(data.message).subscribe(_hist => {
        // console.log(_hist);
        this.messageInput = '';
        this.changeDetector.detectChanges();

      });
    })
  }


  addToHistory(data): Observable<any> {
    return Observable.create(obs => {
      this.history.push(data);
      obs.next(this.history);
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
}

