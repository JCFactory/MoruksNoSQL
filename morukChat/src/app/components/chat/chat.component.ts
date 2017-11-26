import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from "../../classes/user";
import {LoginService} from "../../services/login.service";

const INITIAL_CHANNEL = 'ThaerTube';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {
  @ViewChild('messageContainer') messageContainer : ElementRef;
  @Input()user: User;

  results: Object;
  currentChannel = INITIAL_CHANNEL;
  messageInput = '';
  channels = [
    {name: INITIAL_CHANNEL},
    {name: 'General'},
    {name: 'Default'}
  ];

  constructor(private http: HttpClient, private loginService: LoginService) {
  }

  ngOnInit(): void {
    this.currentChannel = 'INITIAL_CHANNEL';
    this.getChat('INITIAL_CHANNEL');
  }

  updateChat(event): void {
    console.log(event);
    this.currentChannel = event;
    this.getChat(event);

    console.log(this);
  }


  sendMessage(message): void {

    const body = {
      channel: this.currentChannel,
      message: message,
      user: this.user
    };

    console.log(body);
    this.http.post('http://localhost:3000/channels/message', body).subscribe();

    this.messageInput = '';

    setTimeout( () => {
      this.getChat(this.currentChannel);
    }, 750);

  }

  getChat(channelName): void {

    this.http.get('http://localhost:3000/channels/' + channelName)
      .subscribe((_data) => {
        this.results = _data;
        console.log('get Chat', _data);
      });
    setTimeout( () => {this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight},
      50)
  }

}
