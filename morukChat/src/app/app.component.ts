import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Moruk Chat';
  // message: string = '';

  output: any;

  constructor() {

  }

  sendMessage(event: any): void {
    this.output = event.target.value;
  }
}
