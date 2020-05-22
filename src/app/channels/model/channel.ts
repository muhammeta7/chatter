import {Message} from "../../messages/model/message";
import {UserViewModel} from "../../sign-up/sign-up.component";

export interface Channel {
  id: number;
  channelName: string;
  isPrivate: boolean;
  isDm: boolean;
  messages:Message[];
  users:UserViewModel[];
}

