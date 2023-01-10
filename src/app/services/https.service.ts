import {Injectable} from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {ROtp} from "../interface/api.response.interface";
import {AppService} from "./app.service";

@Injectable({ providedIn: 'root'})
export class HttpsService {
  constructor(private http: HttpClient, private as: AppService) { }

  public sendOTP(email: string) {
    return this.http.get<ROtp>(this.as.urlForSendOTP(email));
  }
}
