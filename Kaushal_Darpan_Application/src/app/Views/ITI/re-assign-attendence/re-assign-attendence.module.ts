import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReAssignAttendenceRoutingModule } from './re-assign-attendence-routing.module';
import { ReAssignAttendenceComponent } from './re-assign-attendence.component';


@NgModule({
  declarations: [
    ReAssignAttendenceComponent
  ],
  imports: [
    CommonModule,
    ReAssignAttendenceRoutingModule
  ]
})
export class ReAssignAttendenceModule { }
