import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PMNAMMelaReportBeforeAfterRoutingModule } from './pmnam-mela-report-before-after-routing.module';
import { PMNAMMelaReportBeforeAfterComponent } from './pmnam-mela-report-before-after.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    PMNAMMelaReportBeforeAfterComponent
  ],
  imports: [
    CommonModule,
    PMNAMMelaReportBeforeAfterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    
    TableSearchFilterModule
  ]
})
export class PMNAMMelaReportBeforeAfterModule { }
