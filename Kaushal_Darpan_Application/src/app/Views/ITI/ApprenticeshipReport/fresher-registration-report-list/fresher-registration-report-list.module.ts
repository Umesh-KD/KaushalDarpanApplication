import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { fresherRegistrationReportListRoutingModule } from './fresher-registration-report-list-routing.module';
import { fresherRegistrationReportListComponent } from './fresher-registration-report-list.component';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../material.module';

@NgModule({
  declarations: [
    fresherRegistrationReportListComponent
  ],
  imports: [
    CommonModule,
    fresherRegistrationReportListRoutingModule,
    TableSearchFilterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class fresherRegistrationReportListModule { }
