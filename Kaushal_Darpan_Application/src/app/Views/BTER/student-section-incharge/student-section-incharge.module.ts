import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentSectionInchargeRoutingModule } from './student-section-incharge-routing.module';
import { StudentSectionInchargeComponent } from './student-section-incharge.component';


@NgModule({
  declarations: [
    StudentSectionInchargeComponent
  ],
  imports: [
    CommonModule,
    StudentSectionInchargeRoutingModule
  ], exports: [StudentSectionInchargeComponent]
})
export class StudentSectionInchargeModule { }
