import {UserViewModel} from '../../sign-up/sign-up.component';
import {Channel} from '../../channels/model/channel';

export interface Message {
  id: number;
  content: string;
  timestamp: Date;
  sender: UserViewModel;
  channel: Channel;
}
