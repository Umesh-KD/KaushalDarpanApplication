import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreExamStudentExaminationReportRoutingModule } from './pre-exam-student-examination-report-routing.module';
import { PreExamStudentExaminationReportComponent } from './pre-exam-student-examination-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    PreExamStudentExaminationReportComponent
  ],
  imports: [
    CommonModule,
    PreExamStudentExaminationReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,

  ]
})
export class PreExamStudentExaminationReportModule { }
