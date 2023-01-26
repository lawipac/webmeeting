import { environment } from '../../environments/environment';
import {webSocket} from "rxjs/webSocket";
import {Injectable} from "@angular/core";
import {WebsocketService, MChat} from "./websocket.service";
import {appLocal, MeetingItem} from "../interface/api.response.interface";
import { v4 as uuid } from 'uuid';
import {Subscription} from "rxjs";
import NoSleep from "nosleep.js";

@Injectable({ providedIn: 'root'})
export class AppService {
  appID = environment.jaasAppId;//
  public env = environment;
  public subject = webSocket(environment.wss);

  private al : appLocal = {} as appLocal;


  constructor(private ws: WebsocketService) {
    this.loadAppLocal();
    // setInterval(()=>{
    //   console.log(this.ws.getState());
    // }, 1000);
  }



  public announce(c: Partial<MChat>){
    c.from = this.al;
    c.to = "all";
    this.ws.send(c as MChat);
  }

  public announceInvisible(){
    this.announce({ "to":"all", event: 'APP_INVISIBLE'});
  }
  public announceVisible(){
    this.announce({  "to":"all", event: 'APP_VISIBLE'});
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

  private meetingUrl= "";
  set CurrentMeetingURL(value: string){
    this.meetingUrl = value;
  }
  get CurrentMeetingURL(): string {
    return environment.meetingDomain + this.meetingUrl;
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

  public fromMyself(from: appLocal | string): boolean{
    if (typeof from == 'string') return false;
    if (from.uuid == this.al.uuid) return true;
    return false;
  }

  public subscribe(fn: (msg: MChat) => void, src: string="anonymous"): Subscription {
    return this.ws.subscribe(fn,src);
  }

  detectBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase()
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }

  detectBrowserVersion(){
    var userAgent = navigator.userAgent, tem,
      matchTest = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    if(/trident/i.test(matchTest[1])){
      tem =  /\brv[ :]+(\d+)/g.exec(userAgent) || [];
      return 'IE '+(tem[1] || '');
    }
    if(matchTest[1]=== 'Chrome'){
      tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
      if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    matchTest= matchTest[2]? [matchTest[1], matchTest[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= userAgent.match(/version\/(\d+)/i))!= null) matchTest.splice(1, 1, tem[1]);
    return matchTest.join(' ');
  }



  noSleep = new NoSleep();
  startNoSleep(){
    this.noSleep.enable();
  }

  stopNoSleep(){
    this.noSleep.disable();
  }

}
