import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../services/login.service";
import {User} from "../../classes/user";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userNameInput: string;
  passwordInput: string;
  isLoggedIn: boolean;
  logInTries = 0;
  showWarning: boolean;

  constructor(private loginService: LoginService, private userService: UserService) {
    this.loginService.loggedIn.subscribe(_logged => {
      if (_logged) {
        this.logInTries = 0;
      }
      this.isLoggedIn = _logged;
      this.showWarning = !this.isLoggedIn && this.logInTries > 0
    });
  }

  ngOnInit() {
  }

  onLogIn() {
    if (this.userNameInput && this.passwordInput) {
      this.logInTries++;
      const newUser = new User(this.userNameInput, new Date() );
      this.userService.userSubject.next(newUser);
      this.loginService.sendCredentials(this.passwordInput);
    }
  }

}
