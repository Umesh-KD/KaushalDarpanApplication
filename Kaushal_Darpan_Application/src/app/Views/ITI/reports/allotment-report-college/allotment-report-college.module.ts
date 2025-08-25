import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllotmentReportCollegeRoutingModule } from './allotment-report-college-routing.module';
import { AllotmentReportCollegeComponent } from './allotment-report-college.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    AllotmentReportCollegeComponent
  ],
  imports: [
    CommonModule,
    AllotmentReportCollegeRoutingModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class AllotmentReportCollegeModule { }
