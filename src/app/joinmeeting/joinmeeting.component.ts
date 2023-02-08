import {ChangeDetectorRef, Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AppService} from "../services/app.service";
import {WebsocketService} from "../services/websocket.service";
import {LocalService} from "../services/local.service";
import {AuthService} from "../services/auth.service";
import {HttpsService} from "../services/https.service";
import {Buffer} from "buffer";
import {MeetingItem, SCanJoinMeeting} from "../interface/api.response.interface";

@Component({
  selector: 'app-joinmeeting',
  templateUrl: './joinmeeting.component.html',
  styleUrls: ['./joinmeeting.component.scss']
})
export class JoinmeetingComponent {
  dialogMessage: any;
  opened: any;
  constructor(private route: ActivatedRoute, private app: AppService,
              private ws: WebsocketService,
              private ls: LocalService,
              private auth: AuthService,
              private https: HttpsService ,
              private cdRef : ChangeDetectorRef,
              private router: Router) {
  }
  ngOnInit(){
    this.route.params.subscribe( params => {
      let s = params['token'];
      if (s!= undefined && s != ''){
        this.auth.setOtj(s);
        this.doJoinMeeting(s);

      }else{
        this.dialogMessage("Sorry, Invalid Link");
        this.opened = true;
      }

    } );
  }

  private doJoinMeeting(token: string){
    if (token != "") {
      let j = Buffer.from(token, "base64").toString();
      let {email, room, start} = JSON.parse(Buffer.from(token, "base64").toString());
      let input : SCanJoinMeeting = {
          query: "canJoin",
          room : room,
          start: start,
          email: email
      }
      this.https.getSingleMeeting(input).subscribe(
        data => {
          if (! data.allowed ) {
            if (data.meeting != false) {
              this.dialogMessage = "Sorry, you are not authorized";
            } else {
              this.dialogMessage = "Sorry, meeting not found";
            }
            this.opened = true;
          }else{
            // actually join meeting
            this.app.setCurrentMeetingRoom( data.meeting as MeetingItem);
            this.app.setMagicLInkJoinMeeting(true);
            this.auth.setUser(data.user);
            this.auth.setNick(data.nick);
            this.auth.setJwt (data.jwt);
            this.app.CurrentMeetingURL = data.s3;
            console.log("switching to meeting..", this);
            let _ = this.router.navigate(['vc']);
          }
        }
      );
    }
  }

  close(cancel: string) {
    let _ = this.router.navigate(['/login'])
  }
}
