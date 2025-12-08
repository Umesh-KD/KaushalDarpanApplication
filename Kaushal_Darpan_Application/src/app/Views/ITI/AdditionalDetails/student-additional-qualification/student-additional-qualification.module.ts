import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { StudentAdditionalQualificationComponent } from './student-additional-qualification.component';
import { StudentAdditionalQualificationRoutingModule } from './student-additional-qualification.routing.module';

@NgModule({
  declarations: [
    StudentAdditionalQualificationComponent
  ],
  imports: [
    CommonModule,
    StudentAdditionalQualificationRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class StudentAdditionalQualificationModule { }
