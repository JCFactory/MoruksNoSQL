import { Injectable } from '@angular/core';
import {User} from "../classes/user";
import {Subject} from "rxjs/Subject";

@Injectable()
export class UserService {


  userList: Subject<string[]>;

  constructor() {

  }

}
