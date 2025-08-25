import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PracticalExaminerUndertakingRoutingModule } from './practical-examiner-undertaking-routing.module';
import { PracticalExaminerUndertakingComponent } from './practical-examiner-undertaking.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    PracticalExaminerUndertakingComponent
  ],
  imports: [
    CommonModule,
    PracticalExaminerUndertakingRoutingModule,
    ReactiveFormsModule,
    FormsModule, TableSearchFilterModule
  ]
})
export class PracticalExaminerUndertakingModule { }
