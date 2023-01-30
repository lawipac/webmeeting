import { environment } from '../../environments/environment';
import {webSocket} from "rxjs/webSocket";
import {Injectable} from "@angular/core";
import {WebsocketService, MChat} from "./websocket.service";
import {MeetingItem, SLoginByToken} from "../interface/api.response.interface";

import {Subscription} from "rxjs";
import NoSleep from "nosleep.js";
import {Machine, LocalService} from "./local.service";

@Injectable({ providedIn: 'root'})
export class AppService {
  appID = environment.jaasAppId;//
  public env = environment;
  public subject = webSocket(environment.wss);


  constructor(private ws: WebsocketService, private ls: LocalService) {

  }




  public announce(c: Partial<MChat>){
    c.from = this.ls.getMachine();
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

  private loadAppLocal() {}

  setLocalUser(email: string = ""){
    this.ls.setEmail(email);
  }


  public fromMyself(from: Machine  | string): boolean{
    if (typeof from == 'string') return false;
    if (from.uuid == this.ls.getMachine().uuid) return true;
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

  toggleNoSleep(){
    if (this.noSleep.isEnabled)
      this.stopNoSleep();
    else
      this.stopNoSleep();
  }

  public isMobileBrowser () {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor);
    return check;
  };

}
