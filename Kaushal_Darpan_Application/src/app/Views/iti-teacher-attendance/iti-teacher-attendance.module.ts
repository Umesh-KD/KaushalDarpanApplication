import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiTeacherAttendanceRoutingModule } from './iti-teacher-attendance-routing.module';
import { ItiTeacherAttendanceComponent } from './iti-teacher-attendance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../../material.module';
import { routes } from '../../routes';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    ItiTeacherAttendanceComponent
  ],
  imports: [
    CommonModule,
    ItiTeacherAttendanceRoutingModule,

    FormsModule, ReactiveFormsModule,
    MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
    RouterModule.forChild(routes)
  ]
})
export class ItiTeacherAttendanceModule { }
