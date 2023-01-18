import {Component, ViewChild} from '@angular/core';
import {MeetingItem} from "../interface/api.response.interface";
import {ScheduleMeetingComponent} from "../schedule-meeting/schedule-meeting.component";
import {MeetinglistComponent} from "../meetinglist/meetinglist.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  // @ts-ignore
  @ViewChild(ScheduleMeetingComponent) scheduleMeeting: ScheduleMeetingComponent;
  // @ts-ignore
  @ViewChild(MeetinglistComponent) meetingList: MeetinglistComponent;

  ngAfterViewInit(): void{
    if ( this.meetingList.meetings.length == 0 )
      this.onZeroMeeting();
  }
  onCreate(item: MeetingItem) {
    console.log("in parent",item);
    this.meetingList.meetings.unshift(item);
  }

  onCancel() {
    this.scheduleMeeting.folded=true;
  }

  onZeroMeeting() {
    this.scheduleMeeting.folded=false;
  }
}
