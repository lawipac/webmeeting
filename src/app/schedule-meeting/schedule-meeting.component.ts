import {Component, EventEmitter, NgIterable, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MeetingItem} from "../interface/api.response.interface";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-schedule-meeting',
  templateUrl: './schedule-meeting.component.html',
  styleUrls: ['./schedule-meeting.component.scss']
})
export class ScheduleMeetingComponent {
  @Output()
  meetingCreatedEvent: EventEmitter<MeetingItem> =new EventEmitter<MeetingItem>();
  public rooms: Array<string> = [
    "Auditorium","Public","Seminar","Enquiry","Presale","CustomSupport","Conference"
  ];
  public form: FormGroup;
  public strGuests = "Invite 1 guest";
  public durationOptions = [
    {text: "30 minutes", value : 1800001},
    {text: "60 minutes", value: 3600002},
    {text: "1.5 Hours", value : 4800003},
    {text: "2 Hours", value: 7200004},
    {text: "2.5 Hours", value: 9000005},
    {text: "3 Hours", value: 10800006},
  ];
  constructor(private fb: FormBuilder, private auth: AuthService){
    this.form = this.fb.group({
      room: '',
      start: Date.now(),
      startDate: new Date(),
      duration: 3600,
      numOfGuests: 1,
      guests:this.fb.array([ this.newGuest()]),
      creator: '',
      public: '100'
    });
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
    if (this.guests().length == 0){//become public
      this.form.get("public")?.setValue('100');
      //prepare a blank input
      this.strGuests = `Invite 1 guest (s) `;
      this.form.get("numOfGuests")?.setValue(1);
      this.addGuest();
    }
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
      room: this.form.value.room
    };
    console.log(this.form.value, item);
    this.meetingCreatedEvent.emit(item);
  }
}
