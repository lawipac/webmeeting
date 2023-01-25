import {Component, ElementRef, EventEmitter, Output, QueryList, ViewChildren} from '@angular/core';
import {Guest, MeetingItem, meetingKey} from "../interface/api.response.interface";
import {AuthService} from "../services/auth.service";
import {HttpClient} from "@angular/common/http";
import {HttpsService} from "../services/https.service";
import {MeetingDetailComponent} from "../meeting-detail/meeting-detail.component";
import {AppService} from "../services/app.service";
import {MChat, WsMessage} from "../services/websocket.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-meetinglist',
  templateUrl: './meetinglist.component.html',
  styleUrls: ['./meetinglist.component.scss']
})
export class MeetinglistComponent {
  meetings: MeetingItem[] = [];
  deleted = false;
  newlyCreated = false;
  @Output()
  zeroMeeting : EventEmitter<null> = new EventEmitter<null>();

  // @ts-ignore
  @ViewChildren('app-meeting-detail') cards: QueryList<ElementRef>
  constructor(private auth: AuthService, private https: HttpsService, private app: AppService){}

  ngOnInit() {
    this.wsSub = this.app.subscribe(this.onWsEvent.bind(this), this.constructor.name);
  }

  wsSub: Subscription = {} as Subscription;

  ngOnDestroy(){
    console.log("ws unsubscribed by" + this.constructor.name);
    this.wsSub.unsubscribe();
  }

  ngAfterViewInit(){
    this.https.getMyMeetings(this.auth.user()).subscribe(
      (data) => {
        console.log(data);
        this.meetings = data;
      }
    );
  }

  onDeleteMeeting(input: MeetingDetailComponent) {
    input.deleted = true; //start animation
    setTimeout(() => {
      this.doDelete(input.meeting);
    },1000);// after animation is finished, we do the job
  }

  doDelete(input: Partial<MeetingItem>, announcement=true, deleteFromServer= true){
    this.meetings = this.meetings.filter(m => {
      return !(m.room == input.room && m.start == input.start);
    });
    let mk : meetingKey = {
      "room": input.room ?? "" ,
      "start": input.start ?? 0
    };

    if ( announcement) {
      this.app.announce({"event": "MEETING_DELETED", payload: mk});
    }

    if (deleteFromServer){
      this.https.deleteMeeting(mk).subscribe(data => {
        console.log("delete, comeback", data);
      });
    }

    if (this.meetings.length == 0){
      console.log("zero meeting");
      this.zeroMeeting.emit();
    }
  }

  addOrUpdate(item: MeetingItem, announcement=true): string {
    if ( !this.isMyMeeting(item) ){
      console.log ("not my meeting", item);
      return "notMy";
    }
    let found = false;
    this.meetings.forEach( (e, idx, array) => {
      if (e.room == item.room && e.start == item.start){
        found = true;
        array[idx] = item;
      }
    });

    if (!found){
      this.meetings.unshift(item);
      if (announcement)
        this.app.announce({"event": "MEETING_CREATED",payload: item});
      return "add";//add
    }else{
      if (announcement)
        this.app.announce({"event": "MEETING_UPDATE", payload: item})
      return "update";
    }
  }

  private isMyMeeting(item: MeetingItem): boolean {
    let email = this.auth.user();
    email = email.toLowerCase();
    if (item.creator.toLowerCase() == email && this.auth.isModerator()){
      return true;
    }
    let found = false;
    item.guests.forEach( (g:Guest) =>{
      if (g.email.toLowerCase() == email)
        found = true;
    });
    return found;
  }

  onWsEvent(msg: MChat): void{
    if (msg.event == undefined) return;
    let item : MeetingItem = {} as MeetingItem;
    switch(msg.event){
      case 'MEETING_CREATED':
        if (this.app.fromMyself(msg.from)) return;
        console.log("payload", msg.payload);
        item = msg.payload as MeetingItem;
        this.addOrUpdate(item, false);
        break;
      case 'MEETING_DELETED':
        if (this.app.fromMyself(msg.from)) return;
        console.log("payload", msg.payload);
        item = msg.payload as MeetingItem;
        this.doDelete(item, false, false);
        break;
    }
  }
}
