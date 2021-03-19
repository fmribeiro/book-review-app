import { Component, OnInit } from '@angular/core';
import { Message } from '../../shared/models/message.model';
import { MessageService } from '../../shared/services/message.service';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl, NgForm } from '@angular/forms';
import { UserService } from '../../shared/services/users.service';
import { User } from 'src/app/shared/models/user.model';
import { UtilsService } from '../../shared/services/utils.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  tabIndex = 0;
  receivedMessages: Message[];
  sendedMessages: Message[];


  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private utilsService: UtilsService) {
    }

    ngOnInit(): void {
      this.getReceivedMessages();
      this.getSendedMessages();
    }

    getReceivedMessages():void {
      this.messageService.fetchReceivedMessages().subscribe(
        response => {
          this.receivedMessages = response;
        }
      );
    }

    getSendedMessages(): void {
      this.messageService.fetchSendedMessages().subscribe(
        response => {
          this.sendedMessages = response;
        }
      );
    }

    async onSendMessage(){
      this.getSendedMessages();
      await this.utilsService.delay(500);
    }

  }
