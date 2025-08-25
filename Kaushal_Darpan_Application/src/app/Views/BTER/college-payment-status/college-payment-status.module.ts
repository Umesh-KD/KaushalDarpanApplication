import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollegePaymentStatusRoutingModule } from './college-payment-status-routing.module';
import { CollegePaymentStatusComponent } from './college-payment-status.component';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    CollegePaymentStatusComponent
  ],
  imports: [
    CommonModule,
    CollegePaymentStatusRoutingModule,
    LoaderModule
  ]
})
export class CollegePaymentStatusModule { }
