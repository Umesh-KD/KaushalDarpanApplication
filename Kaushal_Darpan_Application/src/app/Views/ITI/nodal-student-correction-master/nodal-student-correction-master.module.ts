import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NodalStudentCorrectionMasterRoutingModule } from './nodal-student-correction-master-routing.module';
import { NodalStudentCorrectionMasterComponent } from './nodal-student-correction-master.component';


@NgModule({
  declarations: [
    NodalStudentCorrectionMasterComponent
  ],
  imports: [
    CommonModule,
    NodalStudentCorrectionMasterRoutingModule
  ]
})
export class NodalStudentCorrectionMasterModule { }
