import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LabelModule } from '@progress/kendo-angular-label';
import { IconsModule } from '@progress/kendo-angular-icons';
import {ButtonsModule} from "@progress/kendo-angular-buttons";





@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    InputsModule,
    BrowserAnimationsModule,
    LabelModule,
    IconsModule,
    ButtonsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
