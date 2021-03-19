import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '../models/message.model';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private messages: Message[] = [];

  constructor(
    private http: HttpClient,
    private utilsService: UtilsService) { }

    mountMessage(message: any): Message{
      return {
        creationDate: this.utilsService.convertObjetIdToDate(message.id),
        message: message.message,
        sender: message.user.name,
        receiver: message.user.name
      };
    }


    fetchMessages(): Observable<Message[]> {
      const url = this.utilsService.getApiURL() + "/messages";
      return this.http
      .get<any[]>(
        url
      )
      .pipe(
        catchError(this.utilsService.handleError),
        map(messages => {
          return messages.map(message => {
            return this.mountMessage(message);
          });
        }),
        tap(messages => {
          this.messages = messages;
        })
      );
    }

    fetchReceivedMessages(): Observable<Message[]> {
      const url = this.utilsService.getApiURL() + `/messages/received/${this.utilsService.getLoggedUserId()}`;
      return this.http
      .get<any[]>(
        url
      )
      .pipe(
        catchError(this.utilsService.handleError),
        map(messages => {
          return messages.map(message => {
            return this.mountMessage(message);
          });
        }),
        tap(messages => {
          this.messages = messages;
        })
      );
    }

    fetchSendedMessages(): Observable<Message[]> {
      const url = this.utilsService.getApiURL() + `/messages/sended/${this.utilsService.getLoggedUserId()}`;
      return this.http
      .get<any[]>(
        url
      )
      .pipe(
        catchError(this.utilsService.handleError),
        map(messages => {
          return messages.map(message => {
            return this.mountMessage(message);
          });
        }),
        tap(messages => {
          this.messages = messages;
        })
      );
    }


    createNewMessage(message: any) {
      const url = this.utilsService.getApiURL() + "/messages";
      this.http.post<any>(
        url,
        message
      )
      .subscribe(response => {

      });
    }

  }
