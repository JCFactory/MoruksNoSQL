import {Injectable, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import * as shajs from 'sha.js';
import {HttpClient} from "@angular/common/http";
import {User} from "../classes/user";

@Injectable()
export class LoginService {

  loggedIn: Subject<boolean> = new Subject();
  userSubject: Subject<any> = new Subject();
  user: User;

  constructor(private http: HttpClient) {
    this.userSubject.subscribe(_user => {
      this.user = _user;
    })
  }

  sendCredentials(pw: string, user: User): void {
    let encryptedPW = shajs('sha256').update({pw}).digest('hex');
debugger;

    let body = {
      username: user.name,
      password: encryptedPW,
    };

    // if (this.user) {
    //   body.username = user.name;
    //   body.password = encryptedPW;
    // }

    // const body = {
    //   name: this.user.subscribe(_user => _user.name),
    //   message: this.user.subscribe(_user),
    //   user: this.user
    // };

    console.log('body', body);
    this.http.post('http://localhost:3000/users/login', body).subscribe();

  }

}
