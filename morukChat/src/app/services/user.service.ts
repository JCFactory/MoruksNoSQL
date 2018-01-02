import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {User} from "../classes/user";
import {HttpClient} from '@angular/common/http';

@Injectable()
export class UserService {

  userSubject: Subject<any> = new Subject();
  user: User;
  //userList: Subject<any> = new Subject();
  userList: any;


  constructor(private http: HttpClient) {

    this.http.get('http://localhost:3000/users').subscribe(_list => {
      this.userList = _list;
    });
  }

}
