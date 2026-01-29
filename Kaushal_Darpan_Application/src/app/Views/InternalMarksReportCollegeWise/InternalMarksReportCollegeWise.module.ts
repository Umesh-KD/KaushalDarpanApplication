import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { InternalMarksReportCollegeWiseComponent } from './InternalMarksReportCollegeWise.component';
import { InternalMarksReportCollegeWiseRoutingModule } from './InternalMarksReportCollegeWise.routing.module';

@NgModule({
  declarations: [
    InternalMarksReportCollegeWiseComponent
  ],
  imports: [
    CommonModule,
    InternalMarksReportCollegeWiseRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule
  ]
})
export class InternalMarksReportCollegeWiseModule { }
