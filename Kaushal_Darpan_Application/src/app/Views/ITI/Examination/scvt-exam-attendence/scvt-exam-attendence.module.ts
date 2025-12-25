import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScvtExamAttendenceRoutingModule } from './scvt-exam-attendence-routing.module';
import { ScvtExamAttendenceComponent } from './scvt-exam-attendence.component';


@NgModule({
  declarations: [
    ScvtExamAttendenceComponent
  ],
  imports: [
    CommonModule,
    ScvtExamAttendenceRoutingModule
  ]
})
export class ScvtExamAttendenceModule { }
