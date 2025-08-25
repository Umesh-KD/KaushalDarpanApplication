import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreExamStudentExaminationRoutingModule } from './pre-exam-student-examination-routing.module';
import { PreExamStudentExaminationComponent } from './pre-exam-student-examination.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    PreExamStudentExaminationComponent
  ],
  imports: [
    CommonModule,
    PreExamStudentExaminationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,

  ]
})
export class PreExamStudentExaminationModule { }
