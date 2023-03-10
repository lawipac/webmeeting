// src\app\services\websocket.service.ts
import {Injectable} from "@angular/core";
import {Observable, Observer, Subject, Subscription} from 'rxjs';
import {AnonymousSubject} from 'rxjs/internal/Subject';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Machine} from "./local.service";

//machine chat message
export interface MChat {
  from: Machine | string;
  to:   string;
  event: string;
  payload: any;
}

export interface WsMessage {
  action: string;
  data: MChat
}

@Injectable({  providedIn: 'root'})
export class WebsocketService {
  //@ts-ignore
  private subject: AnonymousSubject<MessageEvent> ;
  // @ts-ignore
  private messages: Subject<MChat> = {} as Subject<MChat> ;
  private sendQueue: MChat[] =[];
  //@ts-ignore
  private ws : WebSocket;

  constructor() {
    this.reconnect();
  }

  ngOnDestroy(){
    console.log("destroyed");
  }
  public connect(url: string): AnonymousSubject<MessageEvent> {
    if (this.ws== undefined)
      console.log("in ws undefined");
    else{
      console.log("ws ready-state:", this.ws.readyState);
    }

    this.close();
    //perform connection or re-connection
    this.subject = this.create(url);
    console.log("Successfully connected: " + url);
    return this.subject;
  }

  public close() {
    if (this.subject) {
      this.subject.complete(); //close any existing websocket
    }
  }

  public reconnect() {

    this.messages = <Subject<MChat>>this.connect(environment.wss).pipe(
      map(
        (response: MessageEvent): MChat => {
          console.log("incoming ",response.data);
          let data = JSON.parse(response.data)
          return data;
        }
      )
    );
  }
  private create(url: string): AnonymousSubject<MessageEvent> {
    let ws = new WebSocket(url);
    let observable = new Observable((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
    });
    ws.onopen = this.onOpen.bind(this);
    this.ws = ws;
    let observer = {
      error: (err: Object) => console.log("websocket error", err),
      complete: () => console.log("websocket closed"),
      next: (data: Object) => {
        console.log('Message sent to websocket: ', data);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            action: "onMessage",
            data: data
          }));
        }
      }
    };
    // @ts-ignore
    return new AnonymousSubject<MessageEvent>(observer, observable);
  }

  public onOpen(): void{
    console.log("ws opened", this.ws.readyState);
    while(this.sendQueue.length > 0){
      let m = this.sendQueue.pop();
      if (m != undefined) {
        this.messages.next(m);
      }
    }
  }

  public send( m: MChat) : void{
    if (this.ws.readyState != WebSocket.OPEN){ //not opened
      console.log("queued", this.ws.readyState);
      this.sendQueue.push(m);
    } else{
      console.log("direct send");
      this.messages.next(m);
    }
  }

  public subscribe(fn: (msg: MChat) => void, src: string="anonymous"): Subscription {
    console.log(" ws subscribed by", src);
    return this.messages.subscribe(fn);
  }

  public getState(): number{
    return this.ws.readyState;
  }
}
