import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";

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
  constructor(private auth: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    return this.auth.isAuth();
  }
}
