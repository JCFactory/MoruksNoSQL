import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  userList: any;

  constructor(private userService: UserService) {
    this.userService.userList.subscribe(_list => this.userList = _list);
  }

  ngOnInit() {
  }

}
