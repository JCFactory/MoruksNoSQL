import {Injectable, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import * as shajs from 'sha.js';
import {HttpClient} from "@angular/common/http";
import {User} from "../classes/user";
import {UserService} from "./user.service";

@Injectable()
export class LoginService {

  loggedIn: Subject<boolean> = new Subject();
  user: User;

  constructor(private http: HttpClient, private userService: UserService) {
    this.userService.userSubject.subscribe(_user => {
      this.user = _user;
    })
  }


  sendCredentials(pw: string): void {
    let encryptedPW = shajs('sha256').update(pw).digest('hex');

    let body = {
        username: this.user.name,
        password: encryptedPW,
      };

    // console.log('body', body);
    this.http.post('http://localhost:3000/users/login', body).subscribe(_res => {
      console.log('login post', _res);
      const result = _res['status'];
      this.loggedIn.next(result);
    });

  }

}
