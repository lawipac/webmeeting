import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {Rlogin, ROtp, SLogin} from "../interface/api.response.interface";
import {AppService} from "./app.service";
import {environment} from "../../environments/environment";

@Injectable({ providedIn: 'root'})
export class HttpsService {
  constructor(private http: HttpClient, private as: AppService) { }

   url = new Map<string,string>([
    ["otp", this.as.env.apiBaseUrl + "/otp"],
    ["login", this.as.env.apiBaseUrl + "/login"],
    ["jwt", this.as.env.apiBaseUrl + "/jwt"],
    ["meeting", this.as.env.apiBaseUrl + "/query/meetings"],
    ["recording", this.as.env.apiBaseUrl + "/query/recordings"],
  ]);

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'my-auth-token'
    })
  };

  public setAuthToken(token: string){
    this.httpOptions.headers =
      this.httpOptions.headers.set('Authorization', token);
  }
  public urlForSendOTP(email: string): string{
    return environment.apiBaseUrl + `/otp/${email}`;
  }

  public urlFor(op: string): string{
    return  this.url.get("login") ?? "";
  }
  public sendOTP(email: string) : Observable<ROtp> {
    return this.http.get<ROtp>(this.urlForSendOTP(email));
  }

  public login( param : SLogin): Observable<Rlogin> {
    return this.http.post<Rlogin>(this.urlFor("login"), param, this.httpOptions);
  }
}
