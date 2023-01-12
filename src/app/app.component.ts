import {ChangeDetectorRef, Component, HostListener} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AppService} from "./services/app.service";
import {WebsocketService} from "./services/websocket.service";
import {HttpsService} from "./services/https.service";
import {ROtp} from "./interface/api.response.interface";
import {Md5} from 'ts-md5';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Online Meeting';


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
    this.router.navigate(['login']);
  }

  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange() {
    this.app.checkHiddenDocument();
  }


}

