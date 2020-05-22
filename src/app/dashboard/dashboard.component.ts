import {Component, OnInit} from '@angular/core';
import {UserViewModel} from '../sign-up/sign-up.component';
import {UserService} from '../shared/user.service';
import {Channel} from '../channels/model/channel';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: UserViewModel;
  privateChannels: Channel[];
  users: UserViewModel[];

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getUserByUserName(sessionStorage.getItem('username')).subscribe(
      data => {
        this.currentUser = data;
        data.connected = true;
      });
    this.getChannelsByUser(sessionStorage.getItem('username'));
    this.getAllUsers();
  }

  public getChannelsByUser(username: string){
    this.userService.getAllChannelsByUser(username).subscribe(
      res => {
        this.privateChannels = res;
      }, error => {
        alert('An error has occurred.');
      }
    );
  }

  public getAllUsers(){
    this.userService.getAllUsers().subscribe(
      res => {
        this.users = res;
      }, error => {
        alert('Error');
      }
    );
  }

}
