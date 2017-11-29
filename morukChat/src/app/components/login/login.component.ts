import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../services/login.service";
import {User} from "../../classes/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userName: string;
  password: string;

  constructor(private loginService: LoginService) {
  }

  ngOnInit() {
  }

  onLogIn() {
    // debugger
    if (this.userName && this.password) {
      const newUser = new User(this.userName, new Date() );
      this.loginService.userSubject.next(newUser);
      this.loginService.sendCredentials(this.password, newUser);
      this.loginService.loggedIn.next(true);
    }
  }

}
