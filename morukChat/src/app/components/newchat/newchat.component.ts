import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';

import {User} from "../../classes/user";
import {HttpClient} from '@angular/common/http';
import {UserService} from "../../services/user.service";

@Component({
  selector: 'newchat',
  templateUrl: './newchat.component.html'
})
export class NewchatComponent implements OnInit {

  modalRef: BsModalRef;
  @Input() user: User;
  userList: any;


  constructor(private modalService: BsModalService, private userService: UserService, private http: HttpClient) {
  }


  ngOnInit() {
    this.userList = this.userService.userList;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }


  createChat(contact: any) {

    this.modalRef.hide();

    if (this.user.name != contact) {

      let data = {
        owner: this.user.name,
        participant: contact
      };


      this.http.post<any>('http://localhost:3000/chats', data).subscribe(response => {

        if (response.status == true) {
          alert("Chat wurde erstellt");
        } else {
          console.log("Chat konnte nicht erstellt werden");
        }
      });
    } else {
      alert("Du kannst kein Chat mir dir selber erstellen :/")
    }
  }
}
