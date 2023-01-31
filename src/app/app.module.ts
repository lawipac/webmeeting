import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LabelModule } from '@progress/kendo-angular-label';
import { IconsModule } from '@progress/kendo-angular-icons';
import {ButtonsModule} from "@progress/kendo-angular-buttons";
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { VcComponent } from './vc/vc.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import {AuthInterceptor} from "./services/auth.service";
import { ListViewModule } from '@progress/kendo-angular-listview';
import { ScheduleMeetingComponent } from './schedule-meeting/schedule-meeting.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MeetinglistComponent } from './meetinglist/meetinglist.component';
import { MeetingDetailComponent } from './meeting-detail/meeting-detail.component';
import { TopbarComponent } from './topbar/topbar.component';
import { EmptyComponent } from './empty/empty.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import {SafePipe} from "./pipe/safe.pipe";
import { JoinmeetingComponent } from './joinmeeting/joinmeeting.component';










@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    VcComponent,
    ScheduleMeetingComponent,
    DashboardComponent,
    MeetinglistComponent,
    MeetingDetailComponent,
    TopbarComponent,
    EmptyComponent,
    VideoPlayerComponent,
    SafePipe,
    JoinmeetingComponent
  ],
  imports: [
    BrowserModule,
    InputsModule,
    BrowserAnimationsModule,
    LabelModule,
    IconsModule,
    ButtonsModule,
    AppRoutingModule,
    LayoutModule,
    DateInputsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NotificationModule,
    DialogsModule,
    ListViewModule,
    DropDownsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
