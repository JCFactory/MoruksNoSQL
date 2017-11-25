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

  constructor(private loginService: LoginService) {
  }

  ngOnInit() {
  }

  onLogIn() {
    // debugger
    if (this.userName) {
      const newUser = new User(this.userName, new Date() );
      this.loginService.user.next(newUser);
      this.loginService.loggedIn.next(true);
    }
  }

}
