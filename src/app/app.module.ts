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







@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    VcComponent
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
    DialogsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
