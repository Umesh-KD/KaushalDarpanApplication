import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Iti8ThSeatUtilizationStatusRoutingModule } from './iti-8th-seat-utilization-status-routing.module';
import { Iti8ThSeatUtilizationStatusComponent } from './iti-8th-seat-utilization-status.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { routes } from '../../../../routes';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    Iti8ThSeatUtilizationStatusComponent
  ],
  imports: [
    CommonModule,
    Iti8ThSeatUtilizationStatusRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class Iti8ThSeatUtilizationStatusModule { }











