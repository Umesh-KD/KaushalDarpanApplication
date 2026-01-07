import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { itiPracticalExamMarksRoutingModule } from './iti-Practical-Exam-Marks-routing.module';
import { itiPracticalExamMarksComponent } from './iti-Practical-Exam-Marks.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    itiPracticalExamMarksComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,itiPracticalExamMarksRoutingModule
  ]
})
export class itiPracticalExamMarksModule { }
