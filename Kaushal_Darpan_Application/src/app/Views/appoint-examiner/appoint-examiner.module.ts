import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppointExaminerComponent } from './appoint-examiner.component';
import { LoaderModule } from '../Shared/loader/loader.module';
import { AppointExaminerRoutingModule } from './appoint-examiner.routing.module';



@NgModule({
  declarations: [
    AppointExaminerComponent
  ],
  imports: [
    CommonModule,
    AppointExaminerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    CommonModule
  ]
})
export class AppointExaminerModule { }
