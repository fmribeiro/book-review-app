import { Component } from '@angular/core';
import { Message } from '../../../shared/models/message.model';
import { Input } from '@angular/core';

@Component({
    selector: 'app-message-viewer',
    templateUrl: 'message-viewer.component.html',
    styleUrls: ['message-viewer.component.css']
})
export class MessageViewerComponent {

  @Input()  messages: Message[];
  @Input() isSended: boolean;

}
