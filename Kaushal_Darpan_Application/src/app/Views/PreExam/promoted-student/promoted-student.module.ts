import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromotedStudentRoutingModule } from './promoted-student-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PromotedStudentComponent } from './promoted-student.component';


@NgModule({
  declarations: [
    PromotedStudentComponent
  ],
  imports: [
    CommonModule,
    PromotedStudentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class PromotedStudentModule { }
