import { Component } from '@angular/core';
import {MeetingItem} from "../interface/api.response.interface";

@Component({
  selector: 'app-vc',
  templateUrl: './vc.component.html',
  styleUrls: ['./vc.component.scss']
})
export class VcComponent {
  meetings: MeetingItem[] = [];
}
