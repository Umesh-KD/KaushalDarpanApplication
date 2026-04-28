import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BterStudentAttendenceReportRoutingModule } from './bter-student-attendence-report-routing.module';
import { BterStudentAttendenceReportComponent } from './bter-student-attendence-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';
import { routes } from '../../routes';


@NgModule({
  declarations: [
    BterStudentAttendenceReportComponent
  ],
  imports: [
    CommonModule,
    BterStudentAttendenceReportRoutingModule,
    FormsModule, ReactiveFormsModule,
    CommonModule, MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
    RouterModule.forChild(routes)
  ]
})
export class BterStudentAttendenceReportModule { }
