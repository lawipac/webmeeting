import { Component } from '@angular/core';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {

  constructor(private auth: AuthService){}
  ngOnInit():void{

  }

  logout() {
    this.auth.logout();
  }

  get loggedIn(): boolean{
    return this.auth.isAuth();
  }

  get isModerator(): boolean{
    return this.auth.isModerator();
  }
  get nickName(): string{
    if ( this.loggedIn){
      return this.auth.user();
    }
    return "";
  }
}

