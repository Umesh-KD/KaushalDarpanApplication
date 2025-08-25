import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { ITICenterObserverReportComponent } from './iti-center-observer-report.component';
import { ITICenterObserverReportRoutingModule } from './iti-center-observer-report-routing.module';

@NgModule({
  declarations: [
    ITICenterObserverReportComponent
  ],
  imports: [
    CommonModule,
    ITICenterObserverReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class ItiCenterObserverReportModule { }
