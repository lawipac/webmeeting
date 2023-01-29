import {Injectable} from "@angular/core";
import {WebsocketService} from "./websocket.service";
import {environment} from "../../environments/environment";
import { v4 as uuid } from 'uuid';

export interface Machine {
  version: string
  uuid: string;
  email: string;
  ts: number;
  totalVisit: number
  nick: string;
}

export interface Secret{
  authToken: string;
}

export interface HDD {
  machine: Machine;
  secret: Secret;
}

@Injectable({ providedIn: 'root'})
export class LocalService {
  private hdd: HDD = {
    machine: {},
    secret: { authToken : "" }
  } as HDD;

  constructor(private ws : WebsocketService){
    this.loadAppLocal();
    this.loadAuthToken();
  }

  private loadAppLocal() {
    console.log("Biukop wakeup machine ...");
    let r = this.loadJsonByKey(environment.storageKeyMachine);
    if ( r == false ){
      console.log("Biukop rebuild machine ...");
      this.hdd.machine = this.newMachine();
    }else{
      this.hdd.machine = r;
    }
    //update stats
    this.hdd.machine.totalVisit = this.hdd.machine.totalVisit + 1;
    this.writeMachine(this.hdd.machine);
  }

  private loadJsonByKey(k: string): any {
    const s = localStorage.getItem( k );
    let ret = {};
    if(s && s != "" && s!="{}") {
      try {
        ret = JSON.parse(s);
        return ret;
      } catch(e) {
        return false;
      }
    }else{
      return false;
    }
  }

  private loadAuthToken(){
    console.log("Biukop wake up user ...");
    let r = this.loadJsonByKey(environment.storageKeyToken);
    if ( r == false ){
      console.log("Biukop rebuild person ...");
      this.hdd.secret.authToken = "";
      this.writeSecret(this.hdd.secret);
    }else{
      this.hdd.secret = r;
    }
  }

  setEmail(email: string= ""){
    this.hdd.machine.email = email;
    this.writeMachine(this.hdd.machine);
  }

  setNickname(v: string =""){
    this.hdd.machine.nick = v;
    this.writeMachine(this.hdd.machine);
  }

  public getMachine(): Machine {
    return this.hdd.machine;
  }

  public getSecret(): Secret {
    return this.hdd.secret;
  }

  public setSecret(v: string) {
    this.hdd.secret.authToken = v;
    this.writeSecret(this.hdd.secret);
  }

  newMachine(): Machine {
    let r = {} as Machine;
    r.uuid = this.Uuid();
    r.email= "";
    r.totalVisit = 0;
    return this.updateAutoFieldsMachine(r);
  }

  private updateAutoFieldsMachine(r: Machine): Machine{
    //auto fields
    r.version = environment.version;
    r.ts = Date.now();
    return r;
  }
  writeMachine(v : Machine) {
    let m = this.updateAutoFieldsMachine(v);
    localStorage.setItem(environment.storageKeyMachine, JSON.stringify(m));
  }

  writeSecret(v: Secret){
    const m = v ?? {};
    localStorage.setItem(environment.storageKeyToken, JSON.stringify(m));
  }
  Uuid(): string {
    // return "biukop-" + crypto.randomUUID();
    return "biukop-" + uuid();
  }

  clearAutoLogin() {
    this.setSecret("");
  }
}
