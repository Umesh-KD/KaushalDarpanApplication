import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIAdminStaffRoutingModule } from './itiadmin-staff-routing.module';
import { ITIAdminStaffComponent } from './itiadmin-staff.component';


@NgModule({
  declarations: [
    ITIAdminStaffComponent
  ],
  imports: [
    CommonModule,
    ITIAdminStaffRoutingModule
  ]
})
export class ITIAdminStaffModule { }
