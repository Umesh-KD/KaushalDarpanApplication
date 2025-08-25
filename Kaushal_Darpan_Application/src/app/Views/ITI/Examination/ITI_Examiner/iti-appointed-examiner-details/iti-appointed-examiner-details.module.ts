import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiAppointedExaminerDetailsComponent } from './iti-appointed-examiner-details.component';
import { ItiAppointedExaminerDetailsRoutingModule } from './iti-appointed-examiner-details-routing.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ItiAppointedExaminerDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ItiAppointedExaminerDetailsRoutingModule
  ], exports: [ItiAppointedExaminerDetailsComponent]
})
export class ItiAppointedExaminerDetailsModule { }
