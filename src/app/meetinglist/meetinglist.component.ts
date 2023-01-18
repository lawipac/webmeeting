import {Component, ElementRef, EventEmitter, Output, QueryList, ViewChildren} from '@angular/core';
import {MeetingItem, meetingKey} from "../interface/api.response.interface";
import {AuthService} from "../services/auth.service";
import {HttpClient} from "@angular/common/http";
import {HttpsService} from "../services/https.service";
import {MeetingDetailComponent} from "../meeting-detail/meeting-detail.component";

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
  constructor(private auth: AuthService, private https: HttpsService){}

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
    },1000);
  }

  doDelete(input: Partial<MeetingItem>){
    this.meetings = this.meetings.filter(m => {
      return !(m.room == input.room && m.start == input.start);
    });
    let mk : meetingKey = {
      "room": input.room ?? "" ,
      "start": input.start ?? 0
    };
    this.https.deleteMeeting(mk).subscribe(data => {
      console.log("delete, comeback", data);
    });

    if (this.meetings.length == 0){
      console.log("zero meeting");
      this.zeroMeeting.emit();
    }
  }
}
