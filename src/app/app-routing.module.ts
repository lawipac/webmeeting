import {NgModule} from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { AuthGuard} from "./services/auth.service";
import {LoginComponent} from "./login/login.component";
import {VcComponent} from "./vc/vc.component";
import {ScheduleMeetingComponent} from "./schedule-meeting/schedule-meeting.component";
import {DashboardComponent} from "./dashboard/dashboard.component";


const routes: Routes = [
  { path: 'test/sm', component: ScheduleMeetingComponent },
  { path: 'test/vc', component: VcComponent },
  { path: 'test/dash', component: DashboardComponent },
  { path: 'vc', canActivate:[AuthGuard], component: VcComponent },
  { path: 'dash', canActivate:[AuthGuard], component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/:token', component: LoginComponent },

  //{ path: '**', redirectTo: 'test/vc'},
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }


