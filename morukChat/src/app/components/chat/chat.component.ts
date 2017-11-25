import {Component, Input, OnInit} from '@angular/core';
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

  @Input()user: User;

  results: Object;
  currentChannel = INITIAL_CHANNEL;
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
    console.log('init', this.user);
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
      message: message
    };


    this.http.post('http://localhost:3000/channels/message', body).subscribe();

    setTimeout( () => {
      this.getChat(this.currentChannel);
    }, 750);


  }

  getChat(channelName): void {

    this.http.get('http://localhost:3000/channels/' + channelName).subscribe(data => {
      // Read the result field from the JSON response.
      this.results = data;
      console.log(data);
    });

  }

}
