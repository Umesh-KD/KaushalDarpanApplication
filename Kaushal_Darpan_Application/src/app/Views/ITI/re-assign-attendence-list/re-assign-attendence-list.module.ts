import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReAssignAttendenceListRoutingModule } from './re-assign-attendence-list-routing.module';
import { ReAssignAttendenceListComponent } from './re-assign-attendence-list.component';


@NgModule({
  declarations: [
    ReAssignAttendenceListComponent
  ],
  imports: [
    CommonModule,
    ReAssignAttendenceListRoutingModule
  ]
})
export class ReAssignAttendenceListModule { }
