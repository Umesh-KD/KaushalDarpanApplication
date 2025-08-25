import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreExamStudentRoutingModule } from './pre-exam-student-routing.module';
import { PreExamStudentComponent } from './pre-exam-student.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MaterialModule } from '../../../material.module';


@NgModule({
  declarations: [
    PreExamStudentComponent
  ],
  imports: [
    CommonModule, MaterialModule,
    PreExamStudentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class PreExamStudentModule { }
