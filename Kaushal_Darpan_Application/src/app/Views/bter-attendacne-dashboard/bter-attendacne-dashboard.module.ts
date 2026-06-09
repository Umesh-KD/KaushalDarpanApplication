import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BterAttendanceDashboardComponent } from './bter-attendacne-dashboard.component';
import { LoaderModule } from '../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { BterAttendanceDashboardRoutingModule } from './bter-attendacne-dashboard.routing.module';


@NgModule({
  declarations: [
    BterAttendanceDashboardComponent
  ],
  imports: [
    CommonModule,
    BterAttendanceDashboardRoutingModule,
    FormsModule, ReactiveFormsModule, CommonModule, LoaderModule, TableSearchFilterModule,
  ],
  exports:[BterAttendanceDashboardComponent]
})
export class BterAttendanceDashboardModule { }
