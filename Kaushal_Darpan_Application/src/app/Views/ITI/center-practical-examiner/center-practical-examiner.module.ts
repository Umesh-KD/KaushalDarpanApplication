import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CenterPracticalExaminerRoutingModule } from './center-practical-examiner-routing.module';
import { CenterPracticalExaminerComponent } from './center-practical-examiner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { MaterialModule } from '../../../material.module';


@NgModule({
  declarations: [
    CenterPracticalExaminerComponent
  ],
  imports: [
    CommonModule,
    CenterPracticalExaminerRoutingModule,
    FormsModule, ReactiveFormsModule,
    TableSearchFilterModule,
    MaterialModule,
  ]
})
export class CenterPracticalExaminerModule { }
