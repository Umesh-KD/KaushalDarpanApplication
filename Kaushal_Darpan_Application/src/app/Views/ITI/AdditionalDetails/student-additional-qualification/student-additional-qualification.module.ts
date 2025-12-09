import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { StudentAdditionalQualiComponent } from './student-additional-qualification.component';
import { StudentAdditionalQualiRoutingModule } from './student-additional-qualification.routing.module';

@NgModule({
  declarations: [
    StudentAdditionalQualiComponent
  ],
  imports: [
    CommonModule,
    StudentAdditionalQualiRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class StudentAdditionalQualiModule { }
