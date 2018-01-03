import {
  ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild
} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {User} from "../../classes/user";
import {LoginService} from "../../services/login.service";
import {UserService} from "../../services/user.service";
import {WebsocketService} from "../../services/websocket.service";
import {Observable} from "rxjs/Observable";

const SERVERURL = "http://localhost:3000";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {

  @ViewChild('messageContainer') messageContainer: ElementRef;
  @Input() user: User;
  @Output() openUserList = new EventEmitter();


  channels = []; // Chatlist with History
  chatList: any; // Chatlist from API
  chatHistory: any; // Temporary Chat History
  currentChannelName: string;

  messageInput = '';

  constructor(private http: HttpClient, private _websocketService: WebsocketService, private loginService: LoginService, private userService: UserService, private changeDetector: ChangeDetectorRef) {

    this.chatHistory = [];
  }


  ngOnInit(): void {

    // Get Chatlist of user...
    this.http.get(SERVERURL + '/chats/' + this.user.name).subscribe(_list => {
      this.chatList = _list;
      this.currentChannelName = this.chatList[0].participant;

      this.createChannelArr(() => {

        // Initialize the websocket
        this.initSocket();

        // Load history for each channel
        this.chatList.forEach(element => {

          this.http.get<any>(SERVERURL + '/history/' + this.user.name + '/' + element.participant).subscribe(channelHistory => {

            this.getIndexByName(element.participant, index => {
              this.channels[index].history = channelHistory;

              if (element.participant === this.currentChannelName) {
                this.chatHistory = channelHistory
              }
            });
          });
        });
      });
    });
  }


  /**
   * Get index of a object from this.channels
   * @param {string} name
   * @param callback
   */
  getIndexByName(name: string, callback: any) {

    let index = null;

    for (let i = 0; i < this.channels.length; i++) {
      if (this.channels[i].name == name) {
        index = i;
        callback(index);
        break;
      }
    }

  }


  /**
   * Create channel array
   * @param callback
   */
  createChannelArr(callback: any) {

    let first = true;
    this.chatList.forEach(element => {

      let chatName = element.participant;

      this.channels.push({
        name: chatName,
        selected: first,
        history: []
      });

      if (first) {
        first = false;
      }

    });

    callback();
  }


  /**
   * Add message to temporary chat history
   * @param data
   * @returns {Observable<any>}
   */
  addToHistory(data): Observable<any> {
    return Observable.create(obs => {
      this.chatHistory.push(data.data);
      obs.next(this.chatHistory);
    });
  }


  /**
   * Initalize Socket connection to backend
   */
  initSocket() {

    let data = {
      owner: this.user.name,
      participant: this.currentChannelName,
    };

    this._websocketService.emit('connect-chat', data);
    this.scrollToLastMessage();

    this._websocketService.on('new-message', (data) => {

      this.addToHistory(data).subscribe(_hist => {
        this.messageInput = '';
        this.changeDetector.detectChanges();
        this.scrollToLastMessage();
      });
    });

  }


  /**
   * Scroll window to last message
   */
  scrollToLastMessage() {
    setTimeout(() => {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    }, 50);
  }


  /**
   * Send message
   * @param message
   */
  sendMessage(message): void {

    if (message != '') {

      let data = {
        owner: this.user.name,
        participant: this.currentChannelName,
        message: message
      };

      this._websocketService.emit('new-message', data);
    }

  }


  /**
   * Update chat
   * @param name
   */
  updateChat(name) {

    // Find the currently active channel and store the history in channel.history
    const tempChannel = this.channels.find(channel => channel.selected === true);
    tempChannel.history = this.chatHistory;

    for (const channel of this.channels) {
      if (channel.name === name) {
        channel.selected = true;
        this.chatHistory = channel.history;
        this.currentChannelName = channel.name;

        this._websocketService.clean(() => {
          this._websocketService.init(() => {
            this.initSocket();
          });
        });

      } else {
        channel.selected = false;
      }
    }
  }


  /**
   * Small function to decide the style for the message
   * @param sender
   * @returns {string}
   */
  getStyle(sender: any) {
    if (sender == this.user.name) {
      return 'replies';
    } else {
      return 'sent';
    }
  }


}

