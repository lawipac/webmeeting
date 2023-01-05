import {Component, HostListener} from '@angular/core';
import { webSocket } from "rxjs/webSocket";
import { environment } from '../environments/environment';
declare var JitsiMeetExternalAPI: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  api: any;
  title = 'frontend';
  disconnected = false;
  subject = webSocket('wss://wss.webtradepay.au/meeting-dev');

  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange() {
    this.checkHiddenDocument();
  }

  checkHiddenDocument() {
    console.log('disconnected flag', this.disconnected);
    if (document.hidden) {
      console.log("doc hidden");
      this.subject.next({"action":"onMessage", "data":{ "key": 'invisible'} });
    } else {
      this.subject.complete();
      this.connectWSS();
      this.subject.next({"action":"onMessage", "data":{ "key": 'visible after reconnection'} });
      console.log("message sent?");
    }
  }

  ngOnInit() {
    this.connectWSS();
  }

  connectWSS() {
    this.subject = webSocket('wss://wss.webtradepay.au/meeting-dev');
    this.subject.subscribe(
      msg => console.log('message received: ', msg ), // Called whenever there is a message from the server.
      err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      () =>{  console.log('complete') ; this.disconnected = true; }// Called when connection is closed (for whatever reason).
    )
    this.disconnected = false;
  }

  onClick( event: any) {
    console.log("button clicked, socked closed=", JSON.stringify(this.subject.closed), environment.apiKey);
    this.subject.next({"action":"onMessage", "data":{ "key": 'some message'} });

    this.api = new JitsiMeetExternalAPI("8x8.vc", {
      roomName: "vpaas-magic-cookie-35408203be1646ac811594fa79ddb6ce/sunji",
      configOverwrite: {
        prejoinPageEnabled: false,
        toolbarButtons: ['hangup', 'microphone', 'recording', 'camera'],
      },
      parentNode: document.querySelector('#jaas_container'),
      jwt:'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InZwYWFzLW1hZ2ljLWNvb2tpZS0zNTQwODIwM2JlMTY0NmFjODExNTk0ZmE3OWRkYjZjZS82YzIwNzQifQ.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtMzU0MDgyMDNiZTE2NDZhYzgxMTU5NGZhNzlkZGI2Y2UiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOmZhbHNlLCJzaXAtb3V0Ym91bmQtY2FsbCI6ZmFsc2UsInRyYW5zY3JpcHRpb24iOmZhbHNlLCJyZWNvcmRpbmciOnRydWV9LCJ1c2VyIjp7ImhpZGRlbi1mcm9tLXJlY29yZGVyIjpmYWxzZSwibW9kZXJhdG9yIjp0cnVlLCJuYW1lIjoiYXBpQHN1cGVyZm9yZXguY29tLmF1IiwiaWQiOiJhcGlAc3VwZXJmb3JleC5jb20uYXUiLCJhdmF0YXIiOiIiLCJlbWFpbCI6ImFwaUBzdXBlcmZvcmV4LmNvbS5hdSJ9fSwicm9vbSI6IioiLCJpYXQiOjE2NzI2NTg0OTcsImV4cCI6MTY3Mjc0NDg5N30.SY6ULn5bNPZM3AhL63MJPKftlf3pxze7fTmbXh0Vwfa9cWZmd4s8szX9wZqxpM_lumsaP25XY-84Q8UiguoxELn4luMmswWzkvfE36HIxnjFcyybkUJVf23xl7lz7--nQvI27P36pHQoJ0I3LAVmCFpxULj5jz_2OgrwLEIq0JeXu4F1LMD8faK6dspxLru4lUso9kxpMIkATWffm8QXH-_HVHE-4C2PRW5U_hbS3P-Vz3ZsjPlHsrjxlwTL2wjHPQg9ONRVoyclsPR2qEQfGlDczN4sXAKjYn3MkJPcQ3UehT91bDUgGRuXMZDOFB7iQ5vBRJtLLStBPFlgdB2C7Q'
    });
  }
}

