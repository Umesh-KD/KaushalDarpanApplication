import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllotmentReportCollegeAdminRoutingModule } from './allotment-report-college-admin-routing.module';
import { AllotmentReportCollegeAdminComponent } from './allotment-report-college-admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    AllotmentReportCollegeAdminComponent
  ],
  imports: [
    CommonModule,
    AllotmentReportCollegeAdminRoutingModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class AllotmentReportCollegeAdminModule { }
