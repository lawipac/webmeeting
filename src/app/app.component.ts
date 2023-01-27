import {ChangeDetectorRef, Component, HostListener} from '@angular/core';
import {AppService} from "./services/app.service";
import {MChat, WebsocketService, WsMessage} from "./services/websocket.service";
import {HttpsService} from "./services/https.service";
import {Router} from "@angular/router";
import {environment} from "../environments/environment";
import {Subscription} from "rxjs";
import {Machine} from "./services/local.service";
import {AuthService} from "./services/auth.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Online Meeting - ' + environment.version;
  al : Machine = {} as Machine;

  bname = "";
  bversion ="";
  appVer = "";



  constructor(private app: AppService,
              private auth: AuthService,
              private ws: WebsocketService,
              private https: HttpsService ,
              private cdRef : ChangeDetectorRef,
              private router: Router) {
    console.log(this.app.env);

  }

  wsSub: Subscription = {} as Subscription;
  ngOnInit(){
    this.wsSub = this.ws.subscribe(this.onWsEvent, this.constructor.name);
    this.bname = this.app.detectBrowserName();
    this.bversion = this.app.detectBrowserVersion();
    this.appVer = environment.version;
    this.toggleSleep();

  }

  ngOnDestroy(){
    this.wsSub.unsubscribe();
  }

  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange() {
    this.app.checkHiddenDocument();
  }

  onWsEvent(msg: MChat): void{
    if ( environment.production==false)
      console.log(" app component received ws message", msg);
  }


  noSleep=false;
  toggleSleep() {
    if (this.noSleep){
      this.app.stopNoSleep();
    }else{
      this.app.startNoSleep();
    }
    this.noSleep = ! this.noSleep;
  }
}

