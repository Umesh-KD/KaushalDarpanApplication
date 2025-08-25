import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PracticalExaminerRelievingRoutingModule } from './practical-examiner-relieving-routing.module';
import { PracticalExaminerRelievingComponent } from './practical-examiner-relieving.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    PracticalExaminerRelievingComponent
  ],
  imports: [
    CommonModule,
    PracticalExaminerRelievingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class PracticalExaminerRelievingModule { }
