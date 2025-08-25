import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentEnrollmentReportComponent } from './student-enrollment-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StudentEnrollmentReportRouting } from './student-enrollment-report-routing.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { MaterialModule } from '../../../material.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    StudentEnrollmentReportComponent
  ],
  imports: [
    ScrollingModule, NgSelectModule,
    CommonModule,
    StudentEnrollmentReportRouting,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    MaterialModule
  ],providers:[TableSearchFilterModule]
})
export class StudentEnrollmentReportModule { }
