import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Iti10ThSeatUtilizationStatusRoutingModule } from './iti-10th-seat-utilization-status-routing.module';
import { Iti10ThSeatUtilizationStatusComponent } from './iti-10th-seat-utilization-status.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { routes } from '../../../../routes';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    Iti10ThSeatUtilizationStatusComponent
  ],
  imports: [
    CommonModule,
    Iti10ThSeatUtilizationStatusRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class Iti10ThSeatUtilizationStatusModule { }











