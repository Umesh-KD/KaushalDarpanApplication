import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchFilterModule } from '../../../Pipes/table-search-filter.module';
import { CenterSuperinstendentAPReportComponent } from './CenterSuperinstendent-A-P-Report.component';
import { CenterSuperinstendentAPReportRoutingModule } from './CenterSuperinstendent-A-P-Report-routing.module';


@NgModule({
  declarations: [
    CenterSuperinstendentAPReportComponent
  ],
  imports: [
    CommonModule,
    CenterSuperinstendentAPReportRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TableSearchFilterModule
  ]
})
export class CenterSuperinstendentAPReportModule { }
