import { Location } from '@angular/common'
import {AppService} from "../services/app.service";
import {WebsocketService} from "../services/websocket.service";
import {AuthService} from "../services/auth.service";
import {Component} from "@angular/core";
import {Router} from "@angular/router";
declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-vc',
  templateUrl: './vc.component.html',
  styleUrls: ['./vc.component.scss']
})
export class VcComponent {
  private api: any;
  constructor(private app: AppService,
              private ws: WebsocketService,
              private auth: AuthService,
              private location: Location,
              private router: Router) {
  }
  ngAfterViewInit(){
    if (!this.readyToMeeting()){
        this.back();
    }else{
      this.startMeeting();
    }
  }

  back(): void {
    this.location.back()
  }

  readyToMeeting(): boolean{
    return this.auth.validJWT(this.app.jaasMeetingRoom);
  }

  getUIConfig(){
    let moderatorConfig = {
      prejoinConfig: {enabled: false},
      toolbarButtons: ['hangup', 'microphone', 'recording', 'camera'],
    };
    let guestConfig = {
      prejoinConfig: {enabled: false},
      toolbarButtons: ['hangup', 'microphone',  'camera'],
    }
    if (this.auth.isModerator()){
      return moderatorConfig;
    }else{
      return guestConfig;
    }
  }
  private startMeeting() {
    console.log(this.auth, this.app.jaasMeetingRoom);
    this.api = new JitsiMeetExternalAPI("8x8.vc", {
      roomName: this.app.appID + "/" + this.app.jaasMeetingRoom,
      configOverwrite: this.getUIConfig(),
      parentNode: document.querySelector('#jaas_container'),
      jwt:this.auth.getJwt(),
      userInfo:{
        displayName: this.auth.user()
      }
    });

    this.api.addEventListeners({
      readyToClose: this.handleClose,
      participantLeft: this.handleParticipantLeft.bind(this),
      participantJoined: this.handleParticipantJoined.bind(this),
      videoConferenceJoined: this.handleVideoConferenceJoined.bind(this),
      videoConferenceLeft: this.handleVideoConferenceLeft.bind(this),
      audioMuteStatusChanged: this.handleMuteStatus,
      videoMuteStatusChanged: this.handleVideoStatus
    });
    console.log(this.api);
  }

  handleClose = () => {
    console.log("handleClose");
  }

  handleParticipantLeft = async (participant: any) => {
    console.log("handleParticipantLeft", this, participant); // { id: "2baa184e" }
    const data = await this.getParticipants();
  }

  handleParticipantJoined = async (participant: any) => {
    console.log("handleParticipantJoined", this, participant); // { id: "2baa184e", displayName: "Shanu Verma", formattedDisplayName: "Shanu Verma" }
    const data = await this.getParticipants();
  }

  handleVideoConferenceJoined = async (participant: any) => {
    console.log("handleVideoConferenceJoined", participant); // { roomName: "bwb-bfqi-vmh", id: "8c35a951", displayName: "Akash Verma", formattedDisplayName: "Akash Verma (me)"}
    const data = await this.getParticipants();
  }

  handleVideoConferenceLeft = () => {
    console.log("handleVideoConferenceLeft");
    //delete this.api;
    this.router.navigate(['dash']);
  }

  handleMuteStatus = (audio:any) => {
    console.log("handleMuteStatus", audio); // { muted: true }
  }

  handleVideoStatus = (video:any) => {
    console.log("handleVideoStatus", video); // { muted: true }
  }

  getParticipants() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.api.getParticipantsInfo()); // get all participants
      }, 500)
    });
  }
}
