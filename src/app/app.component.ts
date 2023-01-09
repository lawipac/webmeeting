import {Component, HostListener} from '@angular/core';
import { environment } from '../environments/environment';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AppService} from "./services/app.service";
import {WebsocketService} from "./services/websocket.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Online Meeting';

  otpSent = false;
  hint={
    email: "",
    pin: ""
  };


  constructor(private app: AppService, private ws: WebsocketService) {
    console.log(this.app.env);
    this.ws.messages.subscribe(msg => {
      console.log("received message ", msg);
    });
  }
  public registerForm: FormGroup = new FormGroup({
    nickName: new FormControl(),
    pin: new FormControl(),
    email: new FormControl("", Validators.email),
  });

  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange() {
    this.app.checkHiddenDocument();
  }


  onOtpClick( ) {
    this.otpSent = true;
  }

  onLoginClick() {
    this.otpSent = false;
    this.registerForm.markAllAsTouched();
  }

  emailInputBlur(event:any){
    console.log(event);
  }

}

