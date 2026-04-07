import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InspectionPaymentStatusRoutingModule } from './inpsection-payment-status-routing.module';
import { InspectionPaymentStatusComponent } from './inpsection-payment-status.component';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    InspectionPaymentStatusComponent
  ],
  imports: [
    CommonModule,
    InspectionPaymentStatusRoutingModule,
    LoaderModule
  ]
})
export class InspectionPaymentStatusModule { }
