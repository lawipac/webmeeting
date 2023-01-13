import { Component } from '@angular/core';
import {MeetingItem} from "../interface/api.response.interface";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  meetings: MeetingItem[] = [];
}
