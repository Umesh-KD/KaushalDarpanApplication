import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvigilatorExamListRoutingModule } from './invigilator-exam-list-routing.module';
import { InvigilatorExamListComponent } from './invigilator-exam-list.component';
import { FormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    InvigilatorExamListComponent
  ],
  imports: [
    CommonModule,
    InvigilatorExamListRoutingModule,
    FormsModule,
    TableSearchFilterModule
  ]
})
export class InvigilatorExamListModule { }
