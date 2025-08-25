
import { NodalOfficerExminerReportRoutingModule } from './nodal-officer-exminer-report-routing.module';
import { NodalOfficerExminerReportComponent } from './nodal-officer-exminer-report.component';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { TableSearchFilterPipe } from '../../../Pipes/table-search-filter.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
@NgModule({
  declarations: [
    NodalOfficerExminerReportComponent
  ],
  imports: [
    CommonModule,
    NodalOfficerExminerReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
  ]
})
export class NodalOfficerExminerReportModule { }















