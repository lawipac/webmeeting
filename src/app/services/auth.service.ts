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

@Injectable({ providedIn: 'root'})
export class AuthService {
  private authToken: string ="";
  private email: string = "";
  private otp: string ="";

  private jwt: string="eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtMzU0MDgyMDNiZTE2NDZhYzgxMTU5NGZhNzlkZGI2Y2UvMTIyOTA5LVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE2NzM2Njg2MTEsImV4cCI6MTY3MzY3NTgxMSwibmJmIjoxNjczNjY4NjA2LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtMzU0MDgyMDNiZTE2NDZhYzgxMTU5NGZhNzlkZGI2Y2UiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOnRydWUsInNpcC1vdXRib3VuZC1jYWxsIjpmYWxzZSwidHJhbnNjcmlwdGlvbiI6dHJ1ZSwicmVjb3JkaW5nIjp0cnVlfSwidXNlciI6eyJoaWRkZW4tZnJvbS1yZWNvcmRlciI6ZmFsc2UsIm1vZGVyYXRvciI6dHJ1ZSwibmFtZSI6ImFwaSIsImlkIjoiYXV0aDB8NjM2YzdlYjkyYzc4NmIwZGIyODcxZjEyIiwiYXZhdGFyIjoiIiwiZW1haWwiOiJhcGlAc2ZtYXJrZXRzLmNvbS5hdSJ9fSwicm9vbSI6IioifQ.CGSqzmg1_iqro2O0iIZX26h-LcZy4uBNKDdoLb19169rhj8fBDqgGcM4m8_dbQtTrh-Oq8xra13Jmeks55ijRgQgKo_o3UPs_q3SGvljOooLoL7RwCknebJQERdESahRo7d8W96C3WV12jXJxnLEG00Jgt2LHgSFzA3yXHlSwmMrjy0VIEQkm1Kb0SD9J8La5BKcYbHg_EAIl0gmGTrZaGZF6dSu1xSbdcocbLDjaa9ZdQMxo33CCIdLSP-Dvm8o1eRFHuPWNRP4XG7Xrh7IGQxhGJyOJF09OQlH-vimxZdFkCoyFG8yi8xgYW12YJpm24eLalu3xrw_ST5C-Av5sw";

  private moderator=false;

  private ttl: number = 0;
  private ts: number =0 ;

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
    return decodedJWT.room == "*" || decodedJWT.room == room;
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
