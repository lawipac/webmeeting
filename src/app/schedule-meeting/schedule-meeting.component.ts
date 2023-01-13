import {Component, NgIterable} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-schedule-meeting',
  templateUrl: './schedule-meeting.component.html',
  styleUrls: ['./schedule-meeting.component.scss']
})
export class ScheduleMeetingComponent {
  public rooms: Array<string> = [
    "Auditorium","Public","Seminar","Enquiry","Presale","CustomSupport","Conference"
  ];
  public form: FormGroup;

  constructor(private fb: FormBuilder){
    this.form = this.fb.group({
      room: '',
      start: Date.now(),
      duration: 3600,
      guests:this.fb.array([]),
      creator: ''
    });
  }

  public guests(): FormArray {
    return this.form.get("guests") as FormArray
  }

  public newGuest(): FormGroup{
    return this.fb.group({
      name:'',
      email:'',
    });
  }

  public addGuest() {
    this.guests().push(this.newGuest());
  }
  public removeGuest(i:number){
    this.guests().removeAt(i);
  }
  onRemove(event:any){
    console.log(event);
  }

  onSubmit(){
    console.log(this.form.value);
  }
}
