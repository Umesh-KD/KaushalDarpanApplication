import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BterAssignTeacherRoutingModule } from './bter-assign-teacher-routing.module';
import { BterAssignTeacherComponent } from './bter-assign-teacher.component';


@NgModule({
  declarations: [
    BterAssignTeacherComponent
  ],
  imports: [
    CommonModule,
    BterAssignTeacherRoutingModule
  ]
})
export class BterAssignTeacherModule { }
