import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScvtExamAttendenceRoutingModule } from './scvt-exam-attendence-routing.module';
import { ScvtExamAttendenceComponent } from './scvt-exam-attendence.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ScvtExamAttendenceComponent
  ],
  imports: [
    CommonModule,
    ScvtExamAttendenceRoutingModule,
    FormsModule
  ]
})
export class ScvtExamAttendenceModule { }
