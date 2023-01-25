import { environment } from '../../environments/environment';
import {webSocket} from "rxjs/webSocket";
import {Injectable} from "@angular/core";
import {WsMessage, WebsocketService, MChat} from "./websocket.service";
import {appLocal, MeetingItem} from "../interface/api.response.interface";
import {AuthService} from "./auth.service";
import { v4 as uuid } from 'uuid';

@Injectable({ providedIn: 'root'})
export class AppService {
  appID = environment.jaasAppId;//
  public env = environment;
  public subject = webSocket(environment.wss);

  private al : appLocal = {} as appLocal;

  constructor(private ws: WebsocketService) {
    this.loadAppLocal();
  }

  public announce(c: Partial<MChat>){
    c.from = this.al;
    c.to = "all";
    let m: WsMessage = {
      action : "onMessage",
      data: c as MChat
    }
    this.ws.send(m);
  }

  public announceInvisible(){
    this.announce({ "to":"all", event: 'invisible'});
  }
  public announceVisible(){
    this.announce({  "to":"all", event: 'visible'});
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


  private room = "Lobby";
  private start = 0;
  public setCurrentMeetingRoom (m : Partial<MeetingItem> ){
    this.room = m.room?? "Lobby";
    this.start = m.start?? 0;
  }

  public get jaasMeetingRoom (): string {
    return this.room +"_" + this.start;
  }
  public get currentMeetingRoom(): string{
    return this.room;
  }
  public get currentMeetingStart(): number{
    return this.start;
  }


  private loadAppLocal() {
    const s = localStorage.getItem( environment.appLocal);
    if(s && s != "" && s!="{}") {
      try {
        this.al = JSON.parse(s);
        this.al.totalVisit = this.al.totalVisit + 1;
        this.writeAppLocal();
      } catch(e) {
        this.newAppLocal();
      }
    }else{
      this.newAppLocal();
    }
  }

  newAppLocal(){
    this.al.uuid = this.Uuid();
    this.al.email= "";
    this.al.totalVisit = 0;
    this.writeAppLocal();
  }

  writeAppLocal(){
    this.al.version = environment.version;
    this.al.ts = Date.now();
    localStorage.setItem(environment.appLocal, JSON.stringify(this.al));
  }

  setLocalUser(email: string = ""){
    this.al.email = email;
    this.writeAppLocal();
  }

  Uuid(): string {
    // return "biukop-" + crypto.randomUUID();
    return "biukop-" + uuid();
  }
  getAppLocal(): appLocal {
    return this.al;
  }
}
