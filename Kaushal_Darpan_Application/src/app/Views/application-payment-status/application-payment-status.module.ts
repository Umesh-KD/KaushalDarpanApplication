import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationPaymentStatusRoutingModule } from './application-payment-status-routing.module';
import { ApplicationPaymentStatusComponent } from './application-payment-status.component';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [
    ApplicationPaymentStatusComponent
  ],
  imports: [
    CommonModule,
    ApplicationPaymentStatusRoutingModule,
    LoaderModule
  ]
})
export class ApplicationPaymentStatusModule { }
