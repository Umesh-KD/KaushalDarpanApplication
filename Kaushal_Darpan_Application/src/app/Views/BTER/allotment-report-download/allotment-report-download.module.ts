import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../../../material.module';
import { AllotmentReportDownloadComponent } from './allotment-report-download.component';
import { AllotmentReportDownloadRoutingModule } from './allotment-report-download-routing.module';


@NgModule({
  declarations: [
    AllotmentReportDownloadComponent
  ],
  imports: [
    CommonModule,
    AllotmentReportDownloadRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule,
    LoaderModule,
    NgbPopoverModule, MaterialModule
  ]
})
export class AllotmentReportDownloadModule { }
