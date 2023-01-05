import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Buffer} from 'buffer';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email : string  = "" ;
  otp : string  = "";

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe( params => {
        let s = params['token'];
        let j = Buffer.from(s, "base64").toString();
        let { email, otp} =JSON.parse(Buffer.from(s, "base64").toString());
        this.email = email;
        this.otp = otp;
        console.log(params);
    } );
  }
}
