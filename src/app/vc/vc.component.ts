import { DOCUMENT, Location } from '@angular/common'
import {AppService} from "../services/app.service";
import {WebsocketService} from "../services/websocket.service";
import {AuthService} from "../services/auth.service";
import {Component, Inject} from "@angular/core";
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
              private router: Router,
              @Inject(DOCUMENT) private doc: any) {
  }
  ngAfterViewInit(){
    if (!this.readyToMeeting()){
        this.back();
    }else{
      // if (this.mobileCheck()){
      //   window.location.href=this.app.CurrentMeetingURL;
      // }else{
      this.startMeeting();
      // }

      if (this.mobileCheck()){
        this.toggleFullscreen();
      }
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

  private toggleFullscreen() {
    let elem = this.doc.querySelector("#jaas_container");

    if (!this.doc.fullscreenElement) {
      this.openFullscreen(elem);
    } else {
      this.closeFullscreen();
    }
  }

  private openFullscreen(el: any) {
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.mozRequestFullScreen) {
      /* Firefox */
      el.mozRequestFullScreen();
    } else if (el.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
      /* IE/Edge */
      el.msRequestFullscreen();
    }
  }
  /* Close fullscreen */
  private closeFullscreen() {
    if (this.doc.exitFullscreen) {
      this.doc.exitFullscreen();
    } else if (this.doc.mozCancelFullScreen) {
      /* Firefox */
      this.doc.mozCancelFullScreen();
    } else if (this.doc.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.doc.webkitExitFullscreen();
    } else if (this.doc.msExitFullscreen) {
      /* IE/Edge */
      this.doc.msExitFullscreen();
    }
  }


  private mobileCheck () {
    return this.app.isMobileBrowser();
  };

  private startMeeting() {
    console.log(this.auth, this.app.jaasMeetingRoom);
    this.api = new JitsiMeetExternalAPI("8x8.vc", {
      roomName: this.app.appID + "/" + this.app.jaasMeetingRoom,
      configOverwrite: this.getUIConfig(),
      parentNode: document.querySelector('#jaas_container'),
      jwt:this.auth.getJwt(),
      userInfo:{
        displayName: this.auth.getNick(),
        email:  this.auth.user()
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
    this.app.stopNoSleep();
    //delete this.api;
    if (this.app.getMagicLinkJoinMeeting()) {
      this.auth.logout();
      let _ = this.router.navigate(['login']);
    } else{
      let _ = this.router.navigate(['dash']);
    }
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
