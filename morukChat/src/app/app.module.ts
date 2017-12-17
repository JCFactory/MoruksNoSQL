import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { AlertModule } from 'ngx-bootstrap';
import {FormsModule} from "@angular/forms";

import { AppComponent } from './app.component';
import { ChatComponent } from './components/chat/chat.component';
import { LoginComponent } from './components/login/login.component';
import { RouterModule, Routes } from "@angular/router";
import { UserListComponent } from './components/user-list/user-list.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent,
    UserListComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    AlertModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
