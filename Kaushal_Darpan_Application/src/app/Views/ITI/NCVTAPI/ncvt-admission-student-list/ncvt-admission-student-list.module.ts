import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NcvtAdmissionStudentListRoutingModule } from './ncvt-admission-student-list-routing.module';
import { NcvtAdmissionStudentListComponent } from './ncvt-admission-student-list.component';


@NgModule({
  declarations: [
    NcvtAdmissionStudentListComponent
  ],
  imports: [
    CommonModule,
    NcvtAdmissionStudentListRoutingModule
  ]
})
export class NcvtAdmissionStudentListModule { }
