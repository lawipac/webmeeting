import {Injectable} from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import {Observable} from "rxjs";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {AppService} from "./app.service";

@Injectable({ providedIn: 'root'})
export class AuthService {
  private authToken: string ="";
  private email: string = "";
  private otp: string ="";

  private jwt: string="";


  private moderator=false;

  private ttl: number = 0;
  private ts: number =0 ;

  private nick: string = "";

  constructor(private router: Router, private app: AppService) {
  }

  public setToken(t: string){
    this.authToken = t;
  }

  public token(): string{
    return this.authToken;
  }

  public setOtp(v : string) {
    this.otp = v;
  }

  public setTTL( v: number){
    this.ttl = v;
  }

  public setTS(v:number){
    this.ts = v;
  }

  public setUser(v: string){
    this.email = v;
    this.app.setLocalUser(this.email);
  }

  public setNick(v: string){
    this.nick = v;
    console.log("change to nickname", this.nick);
  }

  public setModerator(v: boolean){
    this.moderator  = v;
  }
  public setJwt(v: string){
    this.jwt = v;
  }

  public isAuth(): boolean{
    //console.log("isAuth", this);
    return this.authToken != "";
  }

  public user(): string {
    return this.email;
  }

  public getNick(): string{
    return this.nick;
  }
  public isModerator(): boolean{
    return this.moderator;
  }

  public getJwt(): string{
    //return "eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtMzU0MDgyMDNiZTE2NDZhYzgxMTU5NGZhNzlkZGI2Y2UvMTIyOTA5LVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE2NzQwNjU3NTIsImV4cCI6MTY3NDA3Mjk1MiwibmJmIjoxNjc0MDY1NzQ3LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtMzU0MDgyMDNiZTE2NDZhYzgxMTU5NGZhNzlkZGI2Y2UiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOmZhbHNlLCJvdXRib3VuZC1jYWxsIjpmYWxzZSwic2lwLW91dGJvdW5kLWNhbGwiOmZhbHNlLCJ0cmFuc2NyaXB0aW9uIjpmYWxzZSwicmVjb3JkaW5nIjpmYWxzZX0sInVzZXIiOnsiaGlkZGVuLWZyb20tcmVjb3JkZXIiOmZhbHNlLCJtb2RlcmF0b3IiOnRydWUsIm5hbWUiOiJUZXN0IFVzZXIiLCJpZCI6ImF1dGgwfDYzNmM3ZWI5MmM3ODZiMGRiMjg3MWYxMiIsImF2YXRhciI6IiIsImVtYWlsIjoidGVzdC51c2VyQGNvbXBhbnkuY29tIn19LCJyb29tIjoiKiJ9.K4qV38O67o5ffCK1KO6lJ2OSupQr-TayF69V63ZPJbkFcagiic-SoDR5YSm6pBH7eBodrXAUjJKLOptgrM9Uv1nFF2j_tZ1uGLc0G1HA-JqnLqs00TBpsSWM8tviS6RqwQH6hyTVrtkSHQEBaAsPiuZMqseg2gYMYZZiCLcCupTYNazzUzW1RFuyakR1cwMii0moXE1rEWfB04VZkqgLt3ZhXkrqGCs5TbUkOKU9BcPlQkNsfU_uK3xQmpAKcs-FwL0DM7PeQC35O_fMH2_bTIj3ZeobLioToCKc9_9wjHnnAB-VAMgpcxYYMGZ_Q55kUxZV_7CrdEO1kJr3aeHa6Q";
    return this.jwt;
  }
  public validJWT(room: string = ""): boolean {
    //decode jwt and match room
    let decodedJWT = JSON.parse(window.atob(this.jwt.split('.')[1]));
    console.log(decodedJWT);
    return room!="" && (decodedJWT.room == "*" || decodedJWT.room == room);
  }

  public logout(){
    this.clearLogin();
    let _ = this.router.navigate(['login']).then(
      () => { location.reload(); }
    );
  }
  public clearLogin(): boolean {
    this.authToken = "";
    this.email = "";
    this.otp = "";
    this.jwt = "";
    this.moderator = false;
    this.ttl = 0;
    this.ts = 0;
    return true;
  }
  public fakeLogin(): boolean {
    //return this.fakeLoginGuest();
    return this.fakeLoginAdmin();
  }

  public fakeLoginGuest(): boolean {
    this.authToken = "ewogICJlbWFpbCI6ICJwYXRyaWNrQGJpdWtvcC5jb20uYXUiLAogICJvdHAiOiAiMzcwNSIKfQ==";
    this.email= "patrick@biukop.com.au";
    this.jwt = "eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtMzU0MDgyMDNiZTE2NDZhYzgxMTU5NGZhNzlkZGI2Y2UvMTIyOTA5LVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE2NzM2NzQ0MzIsImV4cCI6MTY3MzY4MTYzMiwibmJmIjoxNjczNjc0NDI3LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtMzU0MDgyMDNiZTE2NDZhYzgxMTU5NGZhNzlkZGI2Y2UiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOmZhbHNlLCJzaXAtb3V0Ym91bmQtY2FsbCI6ZmFsc2UsInRyYW5zY3JpcHRpb24iOmZhbHNlLCJyZWNvcmRpbmciOnRydWV9LCJ1c2VyIjp7ImhpZGRlbi1mcm9tLXJlY29yZGVyIjpmYWxzZSwibW9kZXJhdG9yIjp0cnVlLCJuYW1lIjoiYXBpIiwiaWQiOiJhdXRoMHw2MzZjN2ViOTJjNzg2YjBkYjI4NzFmMTIiLCJhdmF0YXIiOiIiLCJlbWFpbCI6ImFwaUBzZm1hcmtldHMuY29tLmF1In19LCJyb29tIjoiKiJ9.jmDQY8SyfePYaIc0Y5rSJDAqY6pfQE1s-lQmzxPknBmaMfOcAWzToVoWTZerqPQO41oZ6yCZHqX70gUtjRmaJS67Q6oFUlv1iwFVB1T4J78TRBivymQlzkBuOtyh5mZuYhT9yaGFwyWFyoE66PgBuEs0uMb4KoiMQfIyPM4MwDk-ZD0Akaa1ZEdyvHJ40E-p5FVJDA4k1xgtDJzZbUuHwSjqtAW1Sp0782oV9daO1kmKHLDRQmsyjNSH2bmYNSd5R5XOoM-7FuvoHDKQmPIr6rMHq_OQinGJ6BafKoTlj6-H7RfS7pQeCjQnF_3NaiYTLZyaMLTT6WOGOwZCTvF4HQ";
    this.moderator = false;
    this.otp="3705";
    this.ts=1674039346652;
    this.ttl=17922;
    console.log("fakelogin guest", this);
    return true;
  }

  private fakeLoginAdmin(): boolean{
    this.authToken = "ewogICJlbWFpbCI6ICJhZG1pbkBiaXVrb3AuY29tLmF1IiwKICAib3RwIjogIjY3NjYiCn0=";
    this.email = "admin@biukop.com.au";
    this.otp = "6766";
    this.jwt = "eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtMzU0MDgyMDNiZTE2NDZhYzgxMTU5NGZhNzlkZGI2Y2UvMTIyOTA5LVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE2NzM2NzQ0MzIsImV4cCI6MTY3MzY4MTYzMiwibmJmIjoxNjczNjc0NDI3LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtMzU0MDgyMDNiZTE2NDZhYzgxMTU5NGZhNzlkZGI2Y2UiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOmZhbHNlLCJzaXAtb3V0Ym91bmQtY2FsbCI6ZmFsc2UsInRyYW5zY3JpcHRpb24iOmZhbHNlLCJyZWNvcmRpbmciOnRydWV9LCJ1c2VyIjp7ImhpZGRlbi1mcm9tLXJlY29yZGVyIjpmYWxzZSwibW9kZXJhdG9yIjp0cnVlLCJuYW1lIjoiYXBpIiwiaWQiOiJhdXRoMHw2MzZjN2ViOTJjNzg2YjBkYjI4NzFmMTIiLCJhdmF0YXIiOiIiLCJlbWFpbCI6ImFwaUBzZm1hcmtldHMuY29tLmF1In19LCJyb29tIjoiKiJ9.jmDQY8SyfePYaIc0Y5rSJDAqY6pfQE1s-lQmzxPknBmaMfOcAWzToVoWTZerqPQO41oZ6yCZHqX70gUtjRmaJS67Q6oFUlv1iwFVB1T4J78TRBivymQlzkBuOtyh5mZuYhT9yaGFwyWFyoE66PgBuEs0uMb4KoiMQfIyPM4MwDk-ZD0Akaa1ZEdyvHJ40E-p5FVJDA4k1xgtDJzZbUuHwSjqtAW1Sp0782oV9daO1kmKHLDRQmsyjNSH2bmYNSd5R5XOoM-7FuvoHDKQmPIr6rMHq_OQinGJ6BafKoTlj6-H7RfS7pQeCjQnF_3NaiYTLZyaMLTT6WOGOwZCTvF4HQ", this.moderator = true;
    this.ttl = 15233;
    this.ts = 1673761055491;
    console.log("fakelogin admin", this);
    return true;
  }

}

@Injectable({ providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    if ( this.auth.isAuth() ){
      return true;
    }else{
      //let _ = this.router.navigate(['login']);
    }
    return false;
  }
}

@Injectable({ providedIn: 'root'})
export class DebugLogin implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    if ( this.auth.isAuth() ){
      return true;
    }else{
      // if (environment.production == false){ // do fake login
      //   return this.auth.fakeLogin();
      // }
      return false;
    }
  }
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if account is logged in and request is to the api url
    if (this.auth.isAuth()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.auth.token()}`,
          'x-biukop-otp': this.auth.token(),
          // "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
        }

      });
    }else{
      request = request.clone({
        setHeaders: { Authorization: `Bearer unauthorized` }
      });
    }
    return next.handle(request);
  }
}
