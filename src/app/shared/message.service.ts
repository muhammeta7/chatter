import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Message} from "../messages/model/message";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private BASE_URL = "http://localhost:8080";
  // Message Endpoints
  private BASE_MESSAGES_URL = `${this.BASE_URL}/messages`;
  private GET_MESSAGE_URL = `${this.BASE_URL}/messages`;
  private GET_CHANNEL_MESSAGES = `${this.BASE_URL}/channels/chat/`;
  private ACTUAL_CREATE_MESSAGE = `${this.BASE_MESSAGES_URL}/channel/`;
  private DELETE_MESSAGE_URL = `${this.BASE_MESSAGES_URL}/delete/`;


  constructor(private http: HttpClient) {

  }

  getMessage(id: number): Observable<any> {
    return this.http.get<Message>(this.GET_MESSAGE_URL + '/' + id);
  }

  getAllMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(this.BASE_MESSAGES_URL);
  }


  createMessage(channelId: number, userId: number, message: Message){
    return this.http.post<Message>(this.ACTUAL_CREATE_MESSAGE + channelId + '/sender/' + userId, message);
  }

  getChannelMessages(id: number): Observable<Message[]> {
    return this.http.get<Message[]>(this.GET_CHANNEL_MESSAGES + id);
  }

  updateMessage(id: number, newContent:string){
    const url = `${this.BASE_MESSAGES_URL}/${id}/edit`;
    const param = new FormData();
    param.append('newContent', newContent);
    return this.http.put<Message>(url, param);
  }

  deleteMessage(id:number): Observable<any>{
    return this.http.delete(this.DELETE_MESSAGE_URL + id);
  }

}
