import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicantStudentReportRoutingModule } from './applicant-student-report-routing.module';
import { ApplicantStudentReportComponent } from './applicant-student-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    ApplicantStudentReportComponent
  ],
  imports: [
    CommonModule,
    ApplicantStudentReportRoutingModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class ApplicatntStudentReportModule { }
