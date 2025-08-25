import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectAdmissionReportRoutingModule } from './direct-admission-report-routing.module';
import { DirectAdmissionReportComponent } from './direct-admission-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    DirectAdmissionReportComponent
  ],
  imports: [
    CommonModule,
    DirectAdmissionReportRoutingModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule
  ]
})
export class DirectAdmissionReportModule { }
