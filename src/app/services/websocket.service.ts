// src\app\services\websocket.service.ts
import { Injectable } from "@angular/core";
import { Observable, Observer } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

//machine chat message
export interface MChat {
  from: string;
  to:   string;
  event: string;
}

export interface WsMessage {
  action: string;
  data: MChat
}

@Injectable({  providedIn: 'root'})
export class WebsocketService {
  //@ts-ignore
  private subject: AnonymousSubject<MessageEvent> ;
  public messages: Subject<WsMessage>;

  constructor() {
    this.messages = <Subject<WsMessage>>this.connect(environment.wss).pipe(
      map(
        (response: MessageEvent): WsMessage => {
          console.log(response.data);
          let data = JSON.parse(response.data)
          return data;
        }
      )
    );
  }

  public connect(url: string): AnonymousSubject<MessageEvent> {
    if (this.subject) {
      this.subject.complete(); //close any existing websocket
    }
    //perform connection or re-connection
    this.subject = this.create(url);
    console.log("Successfully connected: " + url);
    return this.subject;
  }

  private create(url: string): AnonymousSubject<MessageEvent> {
    let ws = new WebSocket(url);
    let observable = new Observable((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    let observer = {
      error: null,
      complete: null,
      next: (data: Object) => {
        console.log('Message sent to websocket: ', data);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };
    // @ts-ignore
    return new AnonymousSubject<MessageEvent>(observer, observable);
  }

  public send( m: WsMessage) : void{
    this.messages.next(m);
  }
}
