import {Component, OnInit} from '@angular/core';
import {LoginService} from "./services/login.service";
import {User} from "./classes/user";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [LoginService]
})
export class AppComponent implements OnInit {

  isLoggedIn = false;
  user: User;

  constructor(private loginService: LoginService) {
    this.loginService.loggedIn.subscribe(_logged => {
      this.isLoggedIn = _logged;
    });
    this.loginService.user.subscribe(_user => {
      this.user = _user;
    });
  }

  ngOnInit() {

  }

}
