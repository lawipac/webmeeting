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
import {EmptyComponent} from "./empty/empty.component";
import {JoinmeetingComponent} from "./joinmeeting/joinmeeting.component";



const routes: Routes = [
  { path: 'vc', canActivate:[AuthGuard], component: VcComponent },
  { path: 'dash', canActivate:[AuthGuard], component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/:token', component: LoginComponent },
  { path: 'join/:token', component: JoinmeetingComponent },
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  { path: '**',  component: EmptyComponent},
];

if (environment.production == false){
  routes.push(...[
    { path: 'test/empty',  component: EmptyComponent },
    { path: 'test/sm', canActivate:[DebugLogin], component: ScheduleMeetingComponent },
    { path: 'test/vc', canActivate:[DebugLogin], component: VcComponent },
    { path: 'test/dash', canActivate:[DebugLogin], component: DashboardComponent },
  ]);
}else{
  routes.push(...[
    { path: '**',  component: EmptyComponent},
  ]);
}

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }


