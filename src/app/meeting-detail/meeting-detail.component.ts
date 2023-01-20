import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {MeetingItem} from "../interface/api.response.interface";
import {AppService} from "../services/app.service";
import {Router} from "@angular/router";
import {HttpsService} from "../services/https.service";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-meeting-detail',
  templateUrl: './meeting-detail.component.html',
  styleUrls: ['./meeting-detail.component.scss']
})
export class MeetingDetailComponent {
  @Input()
  meeting: Partial<MeetingItem> = {};
  flipped = false;

  @Output()
  delete: EventEmitter<MeetingDetailComponent> = new EventEmitter<MeetingDetailComponent>();
  @Output()
  edit: EventEmitter<MeetingDetailComponent> = new EventEmitter<MeetingDetailComponent>();
  @Output()
  cancel: EventEmitter<MeetingDetailComponent> = new EventEmitter<MeetingDetailComponent>();
  deleted = false;
  newlyCreated= false;
  urgency: number = 0;

  onEnterMeting() {
    this.app.setCurrentMeetingRoom (this.meeting);
    this.https.renewJwt().subscribe( data =>{
        this.auth.setJwt (data.jwt);
        let _ = this.router.navigate(['vc']);
    });
  }

  constructor(private app: AppService, private router: Router, private https: HttpsService, private auth: AuthService) { }
  ngOnChanges(changes: SimpleChanges) {
    let m = changes['meeting'].currentValue;
    this.calculateWhen2Start(m);
    this.tick();
  }

  private calculateWhen2Start(m: Partial<MeetingItem> = this.meeting): void{
    let ts = Date.now();
    const start = m.start ?? 0;
    const end = m.end ?? 0;
    if (start > ts)
      this.urgency = 1;
    else if (start < ts && end > ts)
      this.urgency = 0;
    else
      this.urgency = -1;
  }

  onDeleteMeeting() {
    this.delete.emit(this);
    console.log("delete meeting");
  }

  get status() : string{
    const status = ["New", "On Going", "Finished", "Abandoned", "Cancelled"];
    let ret =  status[this.meeting.status ?? 4];
    if ( this.urgency < 0 && this.meeting.status == 0) {
      ret = "Abandoned";
    }else     if ( this.urgency > 0 && this.meeting.status == 0) {
      ret = "Scheduled";
    }else     if ( this.urgency == 0 && this.meeting.status == 0) {
      ret = "OnGoing";
    }
    return ret;
  }

  get canEnter(): boolean{
    const ts = Date.now();
    const before = 1800 * 1000;
    const after  = 0;
    const start = this.meeting.start ?? 0;
    const end = this.meeting.end ?? 0;
    if ((this.meeting.status == 0) &&
       ( ts > (start - before ) ) &&
       (ts < (end + after)))
      return true;
    else return false;
  }

  coming = "";

  tick():void{
    setTimeout( ()=>{
      this.calculateWhen2Start();
      const ts = Date.now();
      const start = this.meeting.start ?? 0;
      this.coming = this.secondsToDhms(Math.floor((start - ts)/1000));
      if (this.urgency >= 0){
        this.tick();
      }
    },1000);
  }

  private  secondsToDhms(seconds: number): string {
    seconds = Number(seconds);
    let d = Math.floor(seconds / (3600*24));
    let h = Math.floor(seconds % (3600*24) / 3600);
    let m = Math.floor(seconds % 3600 / 60);
    let s = Math.floor(seconds % 60);

    let dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    let hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    let sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
  }

  frontClicked() {
    if ( this.auth.isModerator())
      this.flipped=true;
  }

  backClicked() {
    this.flipped=false;
  }
}
