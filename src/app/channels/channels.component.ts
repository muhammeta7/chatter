import {Component, OnDestroy, OnInit} from '@angular/core';
import {Channel} from './model/channel';
import {Message} from '../messages/model/message';
import {UserViewModel} from '../sign-up/sign-up.component';
import {ChannelService} from '../shared/channel.service';
import {MessageService} from '../shared/message.service';
import {UserService} from '../shared/user.service';
import {interval, Subscription} from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit, OnDestroy{
  channels: Channel[] = [];
  channelMessages: Message[] = null;
  channelUsers: UserViewModel[] = [];
  currentChannelId = 0;

  publicChannels: Channel[] = [];

  currentUser: UserViewModel = {
    id: null,
    firstName: '',
    lastName: '',
    connected: true,
    userName: '',
    password: '',
    messages: [],
    channels: []
  };

  channelModel: Channel = {
    id: null,
    channelName: '',
    isPrivate: true,
    isDm: false,
    messages: [],
    users: []
  };

  messageModel: Message = {
    id: null,
    content: '',
    timestamp: null,
    sender: null,
    channel: null
  };

  newMessage: Message = null;

  currentMessage: Message;

  dmChannels: Channel[] = [];

  validEdit = false;

  dmChannelModel: Channel = {
    id: null,
    channelName: '',
    isPrivate: true,
    isDm: true,
    messages: [],
    users: []
  };
  private subscription: Subscription;


  constructor(private channelService: ChannelService,
              private messageService: MessageService,
              private userService: UserService
  ){}

  ngOnInit() {
    this.getChannelsByUser(sessionStorage.getItem('username'));
    this.userService.getUserByUserName(sessionStorage.getItem('username')).subscribe(
      data => {
        this.currentUser = data;
        data.connected = true;
        this.getDmChannels();
      });
    this.getAllUsers();
    this.getAllPublicChannels();
  }

  ngOnDestroy(): void{
    this.subscription.unsubscribe();
  }

  selectCurrent(message: Message){
    this.currentMessage = message;
  }

  public getAllUsers(): UserViewModel[]{
    this.userService.getAllUsers().subscribe(
      res => {
        this.channelUsers = res;
      }, error => {
        alert('Error');
      }
    );
    return this.channelUsers;
  }

  public getAllPublicChannels(){
    this.channelService.getAllPublicChannels().subscribe(
      res => {
        this.publicChannels = res;
      },
      error => {
        alert('An error has occurred.');
      }
    );
  }

  public getChannelsByUser(username: string){
    this.userService.getAllChannelsByUser(username).subscribe(
      res => {
        this.channels = res;
      }, error => {
        alert('An error has occurred.');
      }
    );
  }

  public getDmChannels(){
    this.userService.getAllDmChannels(this.currentUser.userName).subscribe(
      res => {
        this.dmChannels = res;
      }, error => {
        alert('An error has occurred.');
      }
    );
  }

  sendMessage(messageModel: Message) {
    messageModel.channel = this.dmChannelModel;
    this.messageService.createMessage(this.currentChannelId, this.currentUser.id, messageModel).subscribe(
      res => {
        this.newMessage = res;
        this.channelMessages.push(this.newMessage);
      }, error => {
        alert('Error while sending message.');
      }
    );
  }

  createChannel() {
    this.channelService.createChannel(this.currentUser.id, this.channelModel).subscribe(
      res => {
        this.channels.push(res);
      }, error => {
        alert('An error has occurred while creating Channel.');
      }
    );
    this.channelModel.channelName = '';
  }

  createDmChannel(otherUserName: string){
    this.channelService.createDmChannel(this.currentUser.userName, otherUserName, this.dmChannelModel).subscribe(
      res => {
        this.dmChannels.push(res);
      }, error => {
        alert('An error has occurred while creating Channel.');
      }
    );
    this.dmChannelModel.channelName = '';
  }

  updateChannel(updatedChannel: Channel) {
    this.channelService.createChannel(this.currentUser.id, updatedChannel).subscribe(
      res => {

      }, error => {
        alert('An error has occurred while updating Channel');
      }
    );
  }

  updateChannelPrivacy(updatedChannel: Channel){
    if (!updatedChannel.isPrivate){
      this.publicChannels = this.publicChannels.filter(obj => obj.id !== updatedChannel.id);
    } else {
      this.publicChannels.push(updatedChannel);
    }
    updatedChannel.isPrivate = !updatedChannel.isPrivate;
    this.channelService.updatePrivacy(updatedChannel).subscribe(
      res => {

      }, error => {
        alert('error');
      }
    );
  }

  deleteChannel(channel: Channel) {
    if (confirm('Are you sure you would like to delete this channel?')){
      this.channelService.deleteChannel(channel.id).subscribe(
        res => {
          const index = this.channels.indexOf(channel);
          this.channels.splice(index, 1);
        }, error => {
          alert('Could not delete channel');
        }
      );
    }
  }

  getChannelMessages(channel: Channel){
    // tslint:disable-next-line:triple-equals
    if (this.subscription != undefined){
      this.subscription.unsubscribe();
    }
    this.currentChannelId = channel.id;
    const interval$ = interval(1000);

    this.subscription = interval$.pipe(
      tap(console.log),
      tap(() => this.messageService.getChannelMessages(this.currentChannelId).subscribe(res => {
        this.channelMessages = res;
      })),
    ).subscribe();
  }

  updateMessage(){
    this.messageService.updateMessage(this.currentMessage.id, this.currentMessage.content).subscribe(
      res => {
        this.channelMessages.find(value =>
          value.id === this.currentMessage.id).content = res.content;
        console.log(res);
      }, error => {
        alert('Error while trying to update message.');
      }
    );
  }

  deleteMessage(message: Message){
    if (confirm('Are you sure you would like to delete this message?')){
      this.messageService.deleteMessage(message.id).subscribe(
        res => {
          const index = this.channelMessages.indexOf(message);
          this.channelMessages.splice(index, 1);
        }, error => {
          alert('Error while deleting message.');
        }
      );
    }
  }

  checkSender(id: number, id2: number) {
    if (id === id2){
      this.validEdit = true;
    }
  }

  getCurrentDmChannel(dmChannel: Channel) {
    this.dmChannelModel = dmChannel;
    console.log(dmChannel);
  }
}
