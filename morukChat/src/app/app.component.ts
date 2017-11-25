import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'app';
  results: string[];
  currentChannel: 'ch_1';


  // TODO das ganze ist schlecht programmier sollte aber fürn Anfang reichen!
  constructor(private http: HttpClient) {

  }


  ngOnInit(): void {
    this.currentChannel = 'ch_1';
    this.getChat("ch_1");
  }


  updateChat($event): void {
    this.currentChannel = $event;
    this.getChat($event);

    console.log(this)
  }


  sendMessage(message): void {

    let body = {
      channel: this.currentChannel,
      message: message
    };

    this.http.post("http://localhost:3000/channels/message", body).subscribe();
    this.getChat(this.currentChannel);

  }

  getChat(channelName): void {

    this.http.get('http://localhost:3000/channels/' + channelName).subscribe(data => {
      // Read the result field from the JSON response.
      this.results = data;
    });

  }

}
