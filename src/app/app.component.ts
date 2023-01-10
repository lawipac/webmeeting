import {Component, HostListener} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AppService} from "./services/app.service";
import {WebsocketService} from "./services/websocket.service";
import {HttpsService} from "./services/https.service";
import {ROtp} from "./interface/api.response.interface";
import {Md5} from 'ts-md5';

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

  otpResponse: ROtp= { otp: "" } as ROtp;

  constructor(private app: AppService, private ws: WebsocketService, private https: HttpsService ) {
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
    this.https.sendOTP(this.registerForm.value.email).subscribe(
      (data: ROtp) =>{
          console.log(data);
          this.otpResponse = {...data};
          this.otpSent = true;
      });
  }

  onLoginClick() {
    this.registerForm.markAllAsTouched();
    if ( this.isOtpMatched()){
      //login
    }else{

    }
  }

  emailInputBlur(event:any){
    console.log(event);
  }

  showLogin(){
    return this.otpSent && this.registerForm.valid && this.registerForm.value.pin !='';
  }

  showOtpInput(){
    return this.registerForm.get('email')?.valid && this.otpSent ;
  }

  showNameInput(){
    return this.isOtpMatched()
  }

  isOtpMatched(){
    const email = this.registerForm.get('email')?.value;
    const pin = this.registerForm.get('pin')?.value;
    const src = email + "-" +  pin ;
    //console.log(email,pin,src,Md5.hashStr(src), this.otpResponse.otp);
    return Md5.hashStr(src) == this.otpResponse.otp;
  }
}

