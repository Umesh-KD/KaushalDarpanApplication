import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { AllExaminerReportComponent } from './AllExaminerReport.component';

import { AllExaminerReportRoutingModule } from './AllExaminerReport-routing.module';

@NgModule({
  declarations: [
    AllExaminerReportComponent
  ],
  imports: [
    CommonModule,
    AllExaminerReportRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TableSearchFilterModule
  ]
})
export class AllExaminerReportodule { }
