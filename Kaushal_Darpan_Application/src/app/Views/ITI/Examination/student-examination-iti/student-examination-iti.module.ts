import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentExaminationITIRoutingModule } from './student-examination-iti-routing.module';
import { StudentExaminationITIComponent } from './student-examination-iti.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    StudentExaminationITIComponent
  ],
  imports: [
    CommonModule,
    StudentExaminationITIRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule,
    NgSelectModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class StudentExaminationITIModule { }
