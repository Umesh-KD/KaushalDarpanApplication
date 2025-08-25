import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PMNAMMelaReportBeforeAfterListRoutingModule } from './pmnam-mela-report-before-after-list-routing.module';
import { PMNAMMelaReportBeforeAfterListComponent } from './pmnam-mela-report-before-after-list.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    PMNAMMelaReportBeforeAfterListComponent
  ],
  imports: [
    CommonModule,
    PMNAMMelaReportBeforeAfterListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class PMNAMMelaReportBeforeAfterListModule { }
