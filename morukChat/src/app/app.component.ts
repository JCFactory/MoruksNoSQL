import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AlertModule} from 'ngx-bootstrap';

const INITIAL_CHANNEL = 'ThaerTube';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'app';
  results: Object;
  currentChannel = INITIAL_CHANNEL;
  channels = [
    {name: INITIAL_CHANNEL},
    {name: 'General'},
    {name: 'Default'}
    ];


  // TODO das ganze ist schlecht programmier sollte aber fürn Anfang reichen!
  constructor(private http: HttpClient) {

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
