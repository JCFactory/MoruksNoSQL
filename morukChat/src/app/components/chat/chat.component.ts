import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from "../../classes/user";
import {LoginService} from "../../services/login.service";
import {UserService} from "../../services/user.service";
import {templateVisitAll} from "@angular/compiler";


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

  results: Object;
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

  constructor(private http: HttpClient, private loginService: LoginService, private userService: UserService) {

    // this.allUsers = this.http.get('http://localhost:3000/users');
  }

  ngOnInit(): void {
    this.updateChat(INITIAL_CHANNEL);
  }

  updateChat(event: string): void {
    // console.log('updateChat', event);
    if (this.currentChannel !== event) {
      this.currentChannel = event;
      this.setChannelSelected(event);
    }
    this.getChat(event);
  }

  buttonClicked() {
    var txt;
    var user;
    if (confirm("Gruppe erstellen") == true) {
      txt = "Ja";
      if (confirm("Kontakte auswählen") == true) {
        this.http.get('http://localhost:3000/users', user).subscribe(data => {
          console.log(data);
        });
      }
    } else {
      txt = "Abbrechen";
    }
  }

  setChannelSelected(event: string): void {
    for (let channel of this.channels) {
      channel.selected = channel.name === event;
    }
  }

  sendMessage(message): void {

    // socket.emit('chat message', 'TEST-test-TEST');

    // const body = {
    //   channel: this.currentChannel,
    //   message: message,
    //   user: this.user
    // };
    //
    // console.log(body);
    // this.http.post('http://localhost:3000/channels/message', body).subscribe();
    //
    // this.messageInput = '';
    //
    // setTimeout(() => {
    //   this.getChat(this.currentChannel);
    // }, 750);
  }

  getChat(channelName): void {

    this.http.get('http://localhost:3000/channels/' + channelName)
      .subscribe((_data) => {
        if (_data) {
          this.results = _data;
          // console.log('get Chat', _data);
        }
      });
    setTimeout(() => {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight
      },
      50)
  }

  showAllUsers() {
    this.http.get('http://localhost:3000/users/')
      .subscribe((data) => {
        // debugger;
        if (data) {
          this.userService.userList.next(data);
        }
        this.openUserList.emit(true);
      });
  }

}

