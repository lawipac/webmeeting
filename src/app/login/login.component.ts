import {ChangeDetectorRef, Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Buffer} from 'buffer';
import {ROtp} from "../interface/api.response.interface";
import {Md5} from "ts-md5";
import {AppService} from "../services/app.service";
import {WebsocketService} from "../services/websocket.service";
import {HttpsService} from "../services/https.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hint={
    email: "",
    otp: ""
  };

  magicTokenLogin = false;
  public registerForm: FormGroup = new FormGroup({
    nick: new FormControl(),
    otp: new FormControl(),
    email: new FormControl("", Validators.email),
  });
  otpResponse: ROtp= { otp: "" } as ROtp;
  constructor(private route: ActivatedRoute, private app: AppService,
              private ws: WebsocketService,
              private auth: AuthService,
              private https: HttpsService ,
              private cdRef : ChangeDetectorRef,
              private router: Router) {
  }

  ngOnInit(){
    this.route.params.subscribe( params => {
      console.log(params, this);
      let s = params['token'];
      if (s!= undefined && s != '')
        this.doMagicTokenLogin(s);
    } );
  }


  private doMagicTokenLogin(token: string){
    if (token != ""){
      let j = Buffer.from(token, "base64").toString();
      let { email, otp} =JSON.parse(Buffer.from(token, "base64").toString());
      this.registerForm.setValue({"email": email, "otp": otp, "nick": email});
      this.magicTokenLogin = true;

      //simulate click login button
      this.onLoginClick();
    }

  }

  onOtpClick( ) {
    let email = this.registerForm.value.email;
    this.https.sendOTP(email).subscribe(
      (data: ROtp) =>{
        console.log(data);
        this.otpResponse = {...data};
        const nick = email.split('@');
        this.registerForm.get('nick')?.setValue(nick[0]);
        this.cdRef.detectChanges();
      });
  }

  onLoginClick() {
    this.registerForm.markAllAsTouched();
    if ( this.isOtpMatched() || this.magicTokenLogin){
      //login
      let email = this.registerForm.value.email;
      let otp = this.registerForm.value.otp;
      const nickName = this.registerForm.get('nickName')?.value;
      this.https.login({email: email,otp: otp, nick: nickName}).subscribe(
        data => {
          console.log(data);
          if (data.status == true) {
            this.auth.setOtp(data.otp);
            this.auth.setTS(data.ts);
            this.auth.setToken(data.auth);
            this.auth.setTTL(data.ttl);
            this.auth.setUser(email);
            this.auth.setModerator(data.isModerator);
            let _ = this.router.navigate(['/dash']);
          }else{
            this.dialogMessage="Magic link expired, please get another code";
            this.opened = true;
          }
        }
      );
    }else{
      //other staff
      this.dialogMessage="One time password Invalid!";
      this.opened = true;
    }
  }

  onOTPKeyDown(){
    this.magicTokenLogin = false;
  }

  showLogin(){
    if (this.magicTokenLogin)
      return true;

    const otpSent = this.otpResponse.emailed;
    return otpSent && this.registerForm.valid && this.registerForm.value.pin !='';
  }

  showOtpInput(){
    if (this.magicTokenLogin)
      return true;

    const otpSent = this.otpResponse.emailed;
    return this.registerForm.get('email')?.valid && otpSent  ;
  }

  showNameInput(){
    return this.isOtpMatched()
  }

  isOtpMatched(){
    const email = this.registerForm.get('email')?.value;
    const otp = this.registerForm.get('otp')?.value;

    const src = email + "-" +  otp ;
    //console.log(email,pin,src,Md5.hashStr(src), this.otpResponse.otp);
    return Md5.hashStr(src) == this.otpResponse.otp;
  }

  public opened = false;
  public dialogMessage="Pin is not correct";
  public close(status: string): void {
    this.opened = false;
    if (this.magicTokenLogin) {
      this.router.navigate(['/login']);
    }
  }
}
