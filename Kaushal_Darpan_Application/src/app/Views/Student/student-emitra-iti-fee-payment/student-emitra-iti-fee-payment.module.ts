import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentEmitraITIFeePaymentRoutingModule } from './student-emitra-iti-fee-payment-routing.module';
import { StudentEmitraITIFeePaymentComponent } from './student-emitra-iti-fee-payment.component';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    StudentEmitraITIFeePaymentComponent
  ],
  imports: [
    CommonModule,
    StudentEmitraITIFeePaymentRoutingModule,
    LoaderModule, FormsModule, ReactiveFormsModule
  ]
})
export class StudentEmitraITIFeePaymentModule { }
