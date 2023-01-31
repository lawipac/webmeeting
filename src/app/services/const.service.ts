import {Injectable} from "@angular/core";
export enum MeetingStatus {
  New =0,
  Ongoing,
  Finished,
  Abandoned,
  Cancelled
}

@Injectable({ providedIn: 'root'})
export class ConstantService {
   MEETING_STATUS = {
    "new": 0,
    "ongoing": 1,
    "finished": 2,
    "abandoned": 3,
    "cancelled": 4
  };

   statusStr(i: number) : string {
     for (const [k,v] of Object.entries(this.MEETING_STATUS)){
        if ( v == i )
          return k ;
     }
     return "new"; //default
   }

   status(s: string): number{
     for (const [k,v] of Object.entries(this.MEETING_STATUS)){
       if ( k.toLowerCase() == s.toLowerCase() )
         return v ;
     }
     return 0;
   }
}
