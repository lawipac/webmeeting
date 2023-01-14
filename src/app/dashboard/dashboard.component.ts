import { Component } from '@angular/core';
import {MeetingItem} from "../interface/api.response.interface";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  meetings: MeetingItem[] = [];
  createMeeting = true;

  onCreate(item: MeetingItem) {
    console.log("in parent",item);
  }

  onCancel() {
    this.createMeeting=false;
  }
}
