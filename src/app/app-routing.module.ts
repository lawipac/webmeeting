import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {LoginComponent} from "./login/login.component";
import {VcComponent} from "./vc/vc.component";


const routes: Routes = [
  { path: 'vc', component: VcComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/:id/:pin', component: LoginComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
