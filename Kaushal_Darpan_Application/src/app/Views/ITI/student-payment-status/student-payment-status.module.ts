import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentPaymentStatusRoutingModule } from './student-payment-status-routing.module';
import { StudentPaymentStatusComponent } from './student-payment-status.component';


@NgModule({
  declarations: [
    StudentPaymentStatusComponent
  ],
  imports: [
    CommonModule,
    StudentPaymentStatusRoutingModule
  ]
})
export class StudentPaymentStatusModule { }
