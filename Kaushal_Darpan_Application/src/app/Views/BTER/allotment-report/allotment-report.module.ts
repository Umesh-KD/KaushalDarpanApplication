import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllotmentReportRoutingModule } from './allotment-report-routing.module';
import { AllotmentReportComponent } from './allotment-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../../../material.module';


@NgModule({
  declarations: [
    AllotmentReportComponent
  ],
  imports: [
    CommonModule,
    AllotmentReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule,
    NgbPopoverModule, MaterialModule
  ]
})
export class AllotmentReportModule { }
