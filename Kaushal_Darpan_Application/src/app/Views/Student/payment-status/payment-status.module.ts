import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentStatusRoutingModule } from './payment-status-routing.module';
import { PaymentStatusComponent } from './payment-status.component';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    PaymentStatusComponent
  ],
  imports: [
    CommonModule,
    PaymentStatusRoutingModule,
    LoaderModule
  ]
})
export class PaymentStatusModule { }
