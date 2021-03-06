import {Component, OnInit} from '@angular/core';
import {LoginService} from "./services/login.service";
import {User} from "./classes/user";
import {UserService} from "./services/user.service";
import {WebsocketService} from "./services/websocket.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [LoginService,UserService, WebsocketService]
})
export class AppComponent implements OnInit {

  isLoggedIn = false;
  user: User;

  constructor(private loginService: LoginService, private userService: UserService) {
    this.loginService.loggedIn.subscribe(_logged => {
      this.isLoggedIn = _logged;
    });
    this.userService.userSubject.subscribe(_user => {
      this.user = _user;
    });
  }

  ngOnInit() {

  }
}
