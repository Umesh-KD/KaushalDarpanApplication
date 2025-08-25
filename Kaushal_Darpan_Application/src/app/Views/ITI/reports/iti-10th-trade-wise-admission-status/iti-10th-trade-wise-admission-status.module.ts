import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Iti10ThTradeWiseAdmissionStatusRoutingModule } from './iti-10th-trade-wise-admission-status-routing.module';
import { Iti10ThTradeWiseAdmissionStatusComponent } from './iti-10th-trade-wise-admission-status.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { routes } from '../../../../routes';
import { LoaderModule } from '../../../Shared/loader/loader.module';
import { TableSearchFilterModule } from '../../../../Pipes/table-search-filter.module';


@NgModule({
  declarations: [
    Iti10ThTradeWiseAdmissionStatusComponent
  ],
  imports: [
    CommonModule,
    Iti10ThTradeWiseAdmissionStatusRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    TableSearchFilterModule
  ]
})
export class Iti10ThTradeWiseAdmissionStatusModule { }











