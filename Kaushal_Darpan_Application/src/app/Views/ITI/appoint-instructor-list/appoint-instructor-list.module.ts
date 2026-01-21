import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointInstructorListRoutingModule } from './appoint-instructor-list-routing.module';
import { AppointInstructorListComponent } from './appoint-instructor-list.component';


@NgModule({
  declarations: [
    AppointInstructorListComponent
  ],
  imports: [
    CommonModule,
    AppointInstructorListRoutingModule
  ]
})
export class AppointInstructorListModule { }
