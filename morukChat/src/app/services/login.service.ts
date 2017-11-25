import {Injectable, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {User} from "../classes/user";

@Injectable()
export class LoginService {

  loggedIn: Subject<boolean> = new Subject();
  user: Subject<any> = new Subject();

  constructor() {
  }

}
