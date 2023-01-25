import {Component, EventEmitter, NgIterable, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MeetingItem} from "../interface/api.response.interface";
import {AuthService} from "../services/auth.service";
import {HttpsService} from "../services/https.service";

@Component({
  selector: 'app-schedule-meeting',
  templateUrl: './schedule-meeting.component.html',
  styleUrls: ['./schedule-meeting.component.scss']
})
export class ScheduleMeetingComponent {
  host: string = "";
  @Output()
  meetingCreatedEvent: EventEmitter<MeetingItem> =new EventEmitter<MeetingItem>();
  @Output()
  abandonedEvent: EventEmitter<null> = new EventEmitter<null>();

  public rooms: Array<string> = [
    "Auditorium","Public","Seminar","Enquiry","Presale","CustomSupport","Conference"
  ];
  public form: FormGroup;
  public strGuests = "Invite 1 guest";
  public durationOptions = [
    {text: "30 minutes", value : 1800001},
    {text: "60 minutes", value: 3600002},
    {text: "1.5 Hours", value : 5400003},
    {text: "2 Hours", value: 7200004},
    {text: "2.5 Hours", value: 9000005},
    {text: "3 Hours", value: 10800006},
  ];
  folded= true;
  constructor(private fb: FormBuilder, private auth: AuthService, private https: HttpsService){
    this.form = this.fb.group({
      room: 'Auditorium',
      start: Date.now(),
      startDate: new Date(),
      duration: 3600002,
      numOfGuests: 1,
      guests:this.fb.array([ ]),
      creator: '',
      public: '100',
      description: ['',Validators.maxLength(200)],
    });
    this.host = this.auth.user();
  }

  public guests(): FormArray {
    return this.form.get("guests") as FormArray
  }

  public newGuest(): FormGroup{
    let r =  this.fb.group({
      name:[''],
      email:['', [Validators.email,Validators.required]],
    });
    return r;
  }

  public addGuest() {
    this.guests().push(this.newGuest());
  }
  public removeGuest(i:number){
    this.guests().removeAt(i);
    let n = this.guests().length;
    this.form.get("numOfGuests")?.setValue(n);
    this.strGuests = `Invite ${n} guest (s) `;
    // if (this.guests().length == 0){//become public
    //   this.form.get("public")?.setValue('100');
    //   //prepare a blank input
    //   this.strGuests = `Invite 1 guest (s) `;
    //   this.form.get("numOfGuests")?.setValue(1);
    //   this.addGuest();
    // }
  }


  onChangeNumOfGuests(){
    let n = this.form.value.numOfGuests
    this.strGuests = `Invite ${n} guest (s) `;
    let old = this.guests().length;
    let diff = old - n;
    if (diff < 0){
      for (let i = old+1; i<=n ; i++){
        this.addGuest();
      }
    }else if (diff > 0){
      for (let i= old ; i> n ; i--){
        this.removeGuest(i -1);
      }
    }

  }
  onSubmit(){
    this.form.markAllAsTouched();
    let item: MeetingItem = {
      ts: Date.now(),
      creator: this.auth.user(),
      guests: this.form.value.guests,
      status: 0,
      public: this.form.value.public,
      end: this.form.value.startDate.getTime() + this.form.value.duration,
      start: this.form.value.startDate.getTime(),
      room: this.form.value.room,
      description: this.form.value.description
    };
    if (this.form.valid){
      this.https.scheduleMeeting(item).subscribe(
        item => {
          console.log(item);
          this.meetingCreatedEvent.emit(item);
        }
      );
    }

  }

  onCancel() {
    this.folded = true;
    // setInterval(()=>{
    //   this.folded = ! this.folded;
    // }, 2000);
    this.abandonedEvent.emit();
  }

  onRadioPublic(e: any) {
    let v =  e.target?.value ?? "'0'";

    if (v == '100'){
        this.emptyGuests();
    }else{
        this.emptyGuests();
        this.addGuest();
    }
    console.log(this);
  }

  private emptyGuests():void {
    let l =this.guests().length;
    let n = 100;
    while ( l > 0 && n >0 ){
      this.removeGuest(0);
      l =this.guests().length;
      n = n-1;
    }
  }

  logout() {
    this.auth.logout();
  }
}
