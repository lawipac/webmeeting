import {Injectable, NgModule} from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { AuthGuard} from "./services/auth.service";
import {LoginComponent} from "./login/login.component";
import {VcComponent} from "./vc/vc.component";
import {ScheduleMeetingComponent} from "./schedule-meeting/schedule-meeting.component";


const routes: Routes = [
  { path: 'test', component: ScheduleMeetingComponent },
  { path: 'vc', canActivate :[AuthGuard], component: VcComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/:token', component: LoginComponent },

  //{ path: '**', redirectTo: 'login'},
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }


