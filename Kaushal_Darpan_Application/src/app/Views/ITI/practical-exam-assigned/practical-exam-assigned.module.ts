import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PracticalExamAssignedRoutingModule } from './practical-exam-assigned-routing.module';
import { PracticalExamAssignedComponent } from './practical-exam-assigned.component';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    PracticalExamAssignedComponent
  ],
  imports: [
    CommonModule,
    PracticalExamAssignedRoutingModule,
    TableSearchFilterModule
  ]
})
export class PracticalExamAssignedModule { }
