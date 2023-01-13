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
      let _ = this.router.navigate(['login']);
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
