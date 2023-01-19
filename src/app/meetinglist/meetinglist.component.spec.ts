import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetinglistComponent } from './meetinglist.component';

describe('MeetinglistComponent', () => {
  let component: MeetinglistComponent;
  let fixture: ComponentFixture<MeetinglistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetinglistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetinglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
