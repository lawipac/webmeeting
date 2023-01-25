import {Component, ViewChild} from '@angular/core';
import {MeetingItem} from "../interface/api.response.interface";
import {ScheduleMeetingComponent} from "../schedule-meeting/schedule-meeting.component";
import {MeetinglistComponent} from "../meetinglist/meetinglist.component";
import {AuthService} from "../services/auth.service";
import {WebsocketService, WsMessage} from "../services/websocket.service";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  // @ts-ignore
  @ViewChild(ScheduleMeetingComponent, {static:false}) scheduleMeeting: ScheduleMeetingComponent;
  // @ts-ignore
  @ViewChild(MeetinglistComponent) meetingList: MeetinglistComponent;

  wsSub: Subscription = {} as Subscription;
  ngOnDestroy(){
    console.log("ws unsubscribed by" + this.constructor.name);
    this.wsSub.unsubscribe();
  }

  ngOnInit() {
    this.wsSub = this.ws.subscribe(this.onWsEvent, this.constructor.name);
  }

  constructor(private auth: AuthService, private ws: WebsocketService){}
  ngAfterViewInit(): void{
    setTimeout( () =>{
      if ( this.meetingList.meetings.length == 0 && this.auth.isModerator() )
        this.onZeroMeeting();
    }, 1000);
  }
  onCreate(item: MeetingItem) {
    this.meetingList.addOrUpdate(item);

  }

  onCancel() {
    this.scheduleMeeting.folded=true;
  }

  onZeroMeeting() {
    this.scheduleMeeting.folded=false;
  }

  get isModerator(): boolean{
    return this.auth.isModerator();
  }
  get noMeeting(): boolean{
    if (this.meetingList != undefined && this.meetingList.meetings.length >0)
      return false;
    return true;
  }

  onWsEvent(msg: WsMessage): void{
    if (msg.data.event == "MEETING_CREATED"){
      console.log("payload", msg.data.payload);
    }
  }
}
