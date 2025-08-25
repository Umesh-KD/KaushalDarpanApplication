import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentEmitraFeePaymentRoutingModule } from './student-emitra-fee-payment-routing.module';
import { StudentEmitraFeePaymentComponent } from './student-emitra-fee-payment.component';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    StudentEmitraFeePaymentComponent
  ],
  imports: [
    CommonModule,
    StudentEmitraFeePaymentRoutingModule,
    LoaderModule, FormsModule, ReactiveFormsModule
  ]
})
export class StudentEmitraFeePaymentModule { }
