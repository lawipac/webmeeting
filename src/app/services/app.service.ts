import { environment } from '../../environments/environment';
import {webSocket} from "rxjs/webSocket";
import {Injectable} from "@angular/core";
import {WsMessage, WebsocketService, MChat} from "./websocket.service";


@Injectable({ providedIn: 'root'})
export class AppService {
  appID = "vpaas-magic-cookie-35408203be1646ac811594fa79ddb6ce";// for superforex
  public room ="";
  public env = environment;
  public subject = webSocket(environment.wss);

  constructor(private ws: WebsocketService) {
  }

  public announce(c: MChat){
    let m: WsMessage = {
      action : "onMessage",
      data: c
    }
    this.ws.send(m);
  }

  public announceInvisible(){
    this.announce({ "from": "browser", "to":"all", event: 'invisible'});
  }
  public announceVisible(){
    this.announce({ "from": "browser", "to":"all", event: 'visible'});
  }

  public checkHiddenDocument() {
    if (document.hidden) {
      this.announceInvisible();
      this.ws.close();
    } else {
      this.ws.reconnect();
      this.announceVisible();
    }
  }



  public urlForSendOTP(email: string): string{
    return environment.apiBaseUrl + `/otp/${email}`;
  }
}
