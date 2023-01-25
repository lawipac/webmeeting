import { DOCUMENT, Location } from '@angular/common'
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
      // if (this.mobileCheck()){
      //   window.location.href=this.app.CurrentMeetingURL;
      // }else{
      this.startMeeting();
      // }
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

  mobileCheck () {
    return true;
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor);
    return check;
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

    function toggleFullscreen() {
      let elem = document.querySelector("#jaas_container");

      if (!document.fullscreenElement) {
        // @ts-ignore
        elem.requestFullscreen().catch((err) => {
          alert(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
        });
      } else {
        document.exitFullscreen();
      }
    }

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
