import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterPipe } from '../../../../Pipes/table-search-filter.pipe';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { NgSelectModule } from '@ng-select/ng-select';
import { PostwiseOfficeVacancyReportComponent } from './postwise-office-vacancy-report.component';
import { PostwiseOfficeVacancyReportRoutingModule } from './postwise-office-vacancy-report-routing.module';

@NgModule({
  declarations: [
    PostwiseOfficeVacancyReportComponent
  ],
  imports: [
    CommonModule,
    PostwiseOfficeVacancyReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule
  ]
})
export class PostwiseOfficeVacancyReportModule { }
