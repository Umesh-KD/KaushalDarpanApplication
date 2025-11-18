import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentEnrollmentReportRoutingModule } from './student-enrollment-report-routing.module';
import { StudentEnrollmentReportComponent } from './student-enrollment-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    StudentEnrollmentReportComponent
  ],
  imports: [
    CommonModule,
    StudentEnrollmentReportRoutingModule,
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule,
    MatTooltipModule
  ]
})
export class StudentEnrollmentReportModule { }
