import { Component, OnInit, TemplateRef } from '@angular/core';
import { Message } from '../messages/model/message';
import { Channel } from '../channels/model/channel';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  modalRef: BsModalRef;
  config = {
    class: 'modal-dialog-centered modal-small',
    animated: true,
  };

  invalidSignUp = false;

  userModel: UserViewModel = {
    id: null,
    firstName: '',
    lastName: '',
    connected: true,
    userName: '',
    password: '',
    messages: [],
    channels: [],
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {}

  createUser(): void {
    this.userService.createUser(this.userModel).subscribe(
      (res) => {
        this.router.navigate(['/login']);
        this.invalidSignUp = true;
      },
      (err) => {
        alert('An error has occurred while creating user!');
      }
    );
  }

  openModal(template: TemplateRef<any>) {
    if (this.invalidSignUp) {
      alert('An error has occured while creating user!');
    } else {
      this.modalRef = this.modalService.show(template, this.config);
    }
  }
}

export interface UserViewModel {
  id: number;
  firstName: string;
  lastName: string;
  connected: boolean;
  userName: string;
  password: string;
  messages: Message[];
  channels: Channel[];
}
