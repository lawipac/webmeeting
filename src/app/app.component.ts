import {ChangeDetectorRef, Component, HostListener} from '@angular/core';
import {AppService} from "./services/app.service";
import {WebsocketService} from "./services/websocket.service";
import {HttpsService} from "./services/https.service";
import {Router} from "@angular/router";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Online Meeting - ' + environment.version;


  constructor(private app: AppService,
              private ws: WebsocketService,
              private https: HttpsService ,
              private cdRef : ChangeDetectorRef,
              private router: Router) {
    console.log(this.app.env);
    this.ws.messages.subscribe(msg => {
      console.log("received message ", msg);
    });
  }

  ngOnInit(){
    // let _ = this.router.navigate(['test']);
  }

  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange() {
    this.app.checkHiddenDocument();
  }


}

