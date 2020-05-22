import {Component, OnInit} from '@angular/core';
import {MessageService} from '../shared/message.service';
import {Message} from './model/message';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  messages: Message[] = [];

  messageModel: {
    id: null,
    content: '',
    timestamp: null,
    sender: null,
    channel: null
  };

  constructor(private messageService: MessageService) {
  }

  ngOnInit() {

  }

  public getMessage(id: number){
    this.messageService.getMessage(id).subscribe(
      res => {
        this.messages.find( x => x.id === id);
      },
      error => {
        alert('An error has occurred.');
      }
    );
  }


}
