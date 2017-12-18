import { Injectable } from '@angular/core';
import {Subject} from "rxjs/Subject";
import {User} from "../classes/user";

@Injectable()
export class UserService {

  userSubject: Subject<any> = new Subject();
  user: User;
  userList: Subject<any> = new Subject();

  constructor() {
    this.userList.subscribe(_res => {console.log('in userService', _res)})
  }

}
