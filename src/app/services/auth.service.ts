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

@Injectable({ providedIn: 'root'})
export class AuthService {
  private authToken: string ="";
  private email: string = "";
  private otp: string ="";

  private jwt: string="eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtMzU0MDgyMDNiZTE2NDZhYzgxMTU5NGZhNzlkZGI2Y2UvMTIyOTA5LVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE2NzM2NzQ0MzIsImV4cCI6MTY3MzY4MTYzMiwibmJmIjoxNjczNjc0NDI3LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtMzU0MDgyMDNiZTE2NDZhYzgxMTU5NGZhNzlkZGI2Y2UiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOmZhbHNlLCJzaXAtb3V0Ym91bmQtY2FsbCI6ZmFsc2UsInRyYW5zY3JpcHRpb24iOmZhbHNlLCJyZWNvcmRpbmciOnRydWV9LCJ1c2VyIjp7ImhpZGRlbi1mcm9tLXJlY29yZGVyIjpmYWxzZSwibW9kZXJhdG9yIjp0cnVlLCJuYW1lIjoiYXBpIiwiaWQiOiJhdXRoMHw2MzZjN2ViOTJjNzg2YjBkYjI4NzFmMTIiLCJhdmF0YXIiOiIiLCJlbWFpbCI6ImFwaUBzZm1hcmtldHMuY29tLmF1In19LCJyb29tIjoiKiJ9.jmDQY8SyfePYaIc0Y5rSJDAqY6pfQE1s-lQmzxPknBmaMfOcAWzToVoWTZerqPQO41oZ6yCZHqX70gUtjRmaJS67Q6oFUlv1iwFVB1T4J78TRBivymQlzkBuOtyh5mZuYhT9yaGFwyWFyoE66PgBuEs0uMb4KoiMQfIyPM4MwDk-ZD0Akaa1ZEdyvHJ40E-p5FVJDA4k1xgtDJzZbUuHwSjqtAW1Sp0782oV9daO1kmKHLDRQmsyjNSH2bmYNSd5R5XOoM-7FuvoHDKQmPIr6rMHq_OQinGJ6BafKoTlj6-H7RfS7pQeCjQnF_3NaiYTLZyaMLTT6WOGOwZCTvF4HQ";


  private moderator=false;

  private ttl: number = 0;
  private ts: number =0 ;

  constructor(private router: Router) {
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

  public isAuth(): boolean{
    console.log("isAuth", this);
    return this.authToken != "";
  }

  public user(): string {
    return this.email;
  }

  public isModerator(): boolean{
    return this.moderator;
  }

  public getJwt(): string{
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
    let _ = this.router.navigate(['login']);
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
    this.authToken = "ewogICJlbWFpbCI6ICJhZG1pbkBiaXVrb3AuY29tLmF1IiwKICAib3RwIjogIjY3NjYiCn0=";
    this.email = "admin@biukop.com.au";
    this.otp = "6766";
    this.jwt = "eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtMzU0MDgyMDNiZTE2NDZhYzgxMTU5NGZhNzlkZGI2Y2UvMTIyOTA5LVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE2NzM2NzQ0MzIsImV4cCI6MTY3MzY4MTYzMiwibmJmIjoxNjczNjc0NDI3LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtMzU0MDgyMDNiZTE2NDZhYzgxMTU5NGZhNzlkZGI2Y2UiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOmZhbHNlLCJzaXAtb3V0Ym91bmQtY2FsbCI6ZmFsc2UsInRyYW5zY3JpcHRpb24iOmZhbHNlLCJyZWNvcmRpbmciOnRydWV9LCJ1c2VyIjp7ImhpZGRlbi1mcm9tLXJlY29yZGVyIjpmYWxzZSwibW9kZXJhdG9yIjp0cnVlLCJuYW1lIjoiYXBpIiwiaWQiOiJhdXRoMHw2MzZjN2ViOTJjNzg2YjBkYjI4NzFmMTIiLCJhdmF0YXIiOiIiLCJlbWFpbCI6ImFwaUBzZm1hcmtldHMuY29tLmF1In19LCJyb29tIjoiKiJ9.jmDQY8SyfePYaIc0Y5rSJDAqY6pfQE1s-lQmzxPknBmaMfOcAWzToVoWTZerqPQO41oZ6yCZHqX70gUtjRmaJS67Q6oFUlv1iwFVB1T4J78TRBivymQlzkBuOtyh5mZuYhT9yaGFwyWFyoE66PgBuEs0uMb4KoiMQfIyPM4MwDk-ZD0Akaa1ZEdyvHJ40E-p5FVJDA4k1xgtDJzZbUuHwSjqtAW1Sp0782oV9daO1kmKHLDRQmsyjNSH2bmYNSd5R5XOoM-7FuvoHDKQmPIr6rMHq_OQinGJ6BafKoTlj6-H7RfS7pQeCjQnF_3NaiYTLZyaMLTT6WOGOwZCTvF4HQ",
      this.moderator = true;
    this.ttl = 15233;
    this.ts = 1673761055491;
    console.log("fakelogin", this);
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
      if (environment.production == false){ // do fake login
        return this.auth.fakeLogin();
      }
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
        setHeaders: { Authorization: `Bearer ${this.auth.token()}` }
      });
    }else{
      request = request.clone({
        setHeaders: { Authorization: `Bearer unauthorized` }
      });
    }
    return next.handle(request);
  }
}
