import {ChangeDetectorRef, Component} from '@angular/core';
import { Location } from '@angular/common'
import {ActivatedRoute, Router} from "@angular/router";
import {AppService} from "../services/app.service";
import {WebsocketService} from "../services/websocket.service";
import {AuthService} from "../services/auth.service";
import {HttpsService} from "../services/https.service";

@Component({
  selector: 'app-vc',
  templateUrl: './vc.component.html',
  styleUrls: ['./vc.component.scss']
})
export class VcComponent {
  constructor(private route: ActivatedRoute, private app: AppService,
              private ws: WebsocketService,
              private auth: AuthService,
              private location: Location,
              private https: HttpsService ,
              private cdRef : ChangeDetectorRef,
              private router: Router) {
  }
  ngOnInit(){
    this.route.params.subscribe( params => {
      console.log(params, this);
      let s = params['room'];
      if (s!= undefined && s != '' && s.length > 10){ // length of epoch 1673662914
        console.log(s);
      }else{
        if (this.auth.isAuth()){
          console.log('back');
            //this.back();
        }else{
          console.log('login');
          //let _ = this.router.navigate(['login']);
        }
      }
    } );
  }

  back(): void {
    this.location.back()
  }


}
