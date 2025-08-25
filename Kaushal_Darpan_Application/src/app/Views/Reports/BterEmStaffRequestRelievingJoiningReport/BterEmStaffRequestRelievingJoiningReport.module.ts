import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { BterEmStaffRequestRelievingJoiningReportComponent } from './BterEmStaffRequestRelievingJoiningReport.component';
import { TableSearchFilterPipe } from '../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BterEmStaffRequestRelievingJoiningReportRoutingModule } from './BterEmStaffRequestRelievingJoiningReport-routing.module';

@NgModule({
  declarations: [
    BterEmStaffRequestRelievingJoiningReportComponent
  ],
  imports: [
    CommonModule,
    BterEmStaffRequestRelievingJoiningReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class BterEmStaffRequestRelievingJoiningReport { }
