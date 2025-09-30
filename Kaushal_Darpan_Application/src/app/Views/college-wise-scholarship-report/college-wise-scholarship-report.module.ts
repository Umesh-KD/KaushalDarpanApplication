import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { CollegeWiseScholarshipReportComponent } from './college-wise-scholarship-report.component';
import { CollegeWiseScholarshipReportRoutingModule } from './college-wise-scholarship-report.routing.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    CollegeWiseScholarshipReportComponent
  ],
  imports: [
    CommonModule,
    CollegeWiseScholarshipReportRoutingModule
    , FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,
    NgSelectModule
  ]
})
export class CollegeWiseScholarshipReportModule { }
