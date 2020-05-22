import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {Channel} from "../channels/model/channel";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  private BASE_URL = "http://localhost:8080";
  private BASE_MESSAGES_URL = `${this.BASE_URL}/messages`;
  // CHANNEL ENDPOINTS
  private BASE_CHANNELS_URL = `${this.BASE_URL}/channels/`;
  private PUBLIC_CHANNELS = `${this.BASE_CHANNELS_URL}public`;
  private GET_CHANNEL_BYID = `${this.BASE_CHANNELS_URL}`;
  private CREATE_CHANNEL_URL = `${this.BASE_CHANNELS_URL}create/user/`;
  private DELETE_CHANNEL_URL = `${this.BASE_CHANNELS_URL}`;

  constructor(private http: HttpClient) {
  }

  // Channel CRUD operations
  getAllChannels(): Observable<Channel[]> {
    return this.http.get<Channel[]>(this.BASE_CHANNELS_URL);
  }

  getChannelById(id: number): Observable<Channel> {
    return this.http.get<Channel>(this.GET_CHANNEL_BYID + '/' + id)
  }

  createChannel(id:number, channel:Channel){
    return this.http.post<Channel>(this.CREATE_CHANNEL_URL + id, channel);
  }

  createDmChannel(userName:string, otherUser:string, channel:Channel){
    return this.http.post<Channel>(this.BASE_CHANNELS_URL + userName + '/dm/' + otherUser, channel);
  }

  getAllPublicChannels(): Observable<Channel[]>{
    return this.http.get<Channel[]>(this.PUBLIC_CHANNELS);
  }

  updatePrivacy(channel:Channel): Observable<Channel>{
    return this.http.put<Channel>(this.BASE_CHANNELS_URL + channel.id + '/changePrivacy', channel);
  }

  deleteChannel(id: number): Observable<any> {
    return this.http.delete(this.DELETE_CHANNEL_URL + id);
  }

}
