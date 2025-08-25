import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { ITIFlyingSquadReportComponent } from './iti-flying-squad-report.component';
import { ITIFlyingSquadReportRoutingModule } from './iti-flying-squad-report-routing.module';

@NgModule({
  declarations: [
    ITIFlyingSquadReportComponent
  ],
  imports: [
    CommonModule,
    ITIFlyingSquadReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class ITIFlyingSquadReportModule { }
