import {NgModule} from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import {AuthGuard, DebugLogin} from "./services/auth.service";
import {LoginComponent} from "./login/login.component";
import {VcComponent} from "./vc/vc.component";
import {ScheduleMeetingComponent} from "./schedule-meeting/schedule-meeting.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {environment} from "../environments/environment";



const routes: Routes = [
  { path: 'vc', canActivate:[AuthGuard], component: VcComponent },
  { path: 'dash', canActivate:[AuthGuard], component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/:token', component: LoginComponent },

  //{ path: '**', redirectTo: 'test/vc'},
];

if (environment.production == false){
  routes.push(...[
    { path: 'test/sm', canActivate:[DebugLogin], component: ScheduleMeetingComponent },
    { path: 'test/vc', canActivate:[DebugLogin], component: VcComponent },
    { path: 'test/dash', canActivate:[DebugLogin], component: DashboardComponent },
  ]);
}

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }


