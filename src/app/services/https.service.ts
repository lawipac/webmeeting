import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {
  MeetingItem,
  meetingKey,
  RDeleteMeeting, RJwt,
  Rlogin,
  ROtp, SJwt,
  SLogin,
  SQueryMeeting
} from "../interface/api.response.interface";
import {AppService} from "./app.service";
import {environment} from "../../environments/environment";
import {AuthService} from "./auth.service";

@Injectable({ providedIn: 'root'})
export class HttpsService {
  constructor(private http: HttpClient, private app: AppService, private auth: AuthService) { }

   url = new Map<string,string>([
    ["otp", this.app.env.apiBaseUrl + "/otp"],
    ["login", this.app.env.apiBaseUrl + "/login"],
    ["schedule-meeting", this.app.env.apiBaseUrl + "/schedule-meeting"],
    ["jwt", this.app.env.apiBaseUrl + "/jwt"],
    ["meeting", this.app.env.apiBaseUrl + "/query/meetings"],
    ["recording", this.app.env.apiBaseUrl + "/query/recordings"],
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
    return  this.url.get(op) ?? "";
  }
  public sendOTP(email: string) : Observable<ROtp> {
    return this.http.get<ROtp>(this.urlForSendOTP(email));
  }

  public login( param : SLogin): Observable<Rlogin> {
    return this.http.post<Rlogin>(this.urlFor("login"), param, this.httpOptions);
  }

  public scheduleMeeting(item: MeetingItem): Observable<MeetingItem>{
    return this.http.post<MeetingItem>(this.urlFor('schedule-meeting'), item);
  }

  public getMyMeetings(email =""): Observable<MeetingItem[]>{
    let input = {
      query:  "my",
      email: email,
      ts: Date.now()
    }
    return this.http.post<MeetingItem[]>(this.urlFor('meeting'), input);
  }

  public deleteMeeting(input: meetingKey): Observable<RDeleteMeeting> {
    return this.http.delete<RDeleteMeeting>(this.urlFor('meeting'), {body: [input]});
  }

  public renewJwt() : Observable<RJwt>{
    let input: SJwt ={
      email: this.auth.user(),
      room: this.app.currentMeetingRoom,
      start: this.app.currentMeetingStart,
      nick: this.auth.getNick()
    }
    return this.http.post<RJwt>(this.urlFor('jwt'), input);
  }
}
