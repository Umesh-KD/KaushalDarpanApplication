import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MaterialModule } from '../../../material.module';
import { PreExamStudentReportComponent } from './pre-exam-student-reoprt.component';
import { PreExamStudentReportRoutingModule } from './pre-exam-student-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    PreExamStudentReportComponent
  ],
  imports: [
    CommonModule, MaterialModule, NgSelectModule,
    PreExamStudentReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class PreExamStudentReportModule { }
