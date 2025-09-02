import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetCalendarRoutingModule } from './SetCalendar-routing.module';
import { SetCalendarComponent } from './SetCalendar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    SetCalendarComponent
  ],
  imports: [
    CommonModule,
    SetCalendarRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ]
})
export class SetCalendarModule { }
