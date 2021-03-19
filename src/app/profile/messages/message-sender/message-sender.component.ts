import { debounceTime, distinctUntilChanged, startWith, map, filter } from 'rxjs/operators';
import { EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MessageService } from '../../../shared/services/message.service';
import { UserService } from '../../../shared/services/users.service';
import { UtilsService } from '../../../shared/services/utils.service';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-message-sender',
  templateUrl: './message-sender.component.html',
  styleUrls: ['./message-sender.component.css']
})
export class MessageSenderComponent implements OnInit {

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  usersFollowing: User[];
  @Output() wasMessageSended = new EventEmitter();

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private utilsService: UtilsService) {
    this.getUsers();
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      filter(value => value !== undefined),
      map((value: string) => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  getUsers(): void {
    this.userService.mountFollowUsersProfile(this.utilsService.getLoggedUserId())
      .subscribe(
        users => {
          this.usersFollowing = users;
          this.usersFollowing.map(user => {
            this.options.push(user.name);
          });
        }
      );
  }

  sendMessage(messageForm: NgForm): void {
    if (!messageForm.valid) {
      return;
    }

    const messageReceiverName = this.myControl.value;
    const messageReceiver = this.usersFollowing.filter(user =>
      user.name === messageReceiverName
    );
    const messageReceiverId = messageReceiver[0].id;


    const message = {
      message: messageForm.value.message,
      sender: this.utilsService.getLoggedUserId(),
      receiver: messageReceiverId,

    };
    this.messageService.createNewMessage(message);

    messageForm.resetForm();
    this.myControl.reset();
    this.utilsService.showAlertMessage('Mensagem enviada com sucesso!');
    this.wasMessageSended.emit(true);
  }
}
