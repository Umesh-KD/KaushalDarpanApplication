import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RevaluationStudentMakePaymentRoutingModule } from './revaluation-student-make-payment-routing.module';
import { RevaluationStudentMakePaymentComponent } from './revaluation-student-make-payment.component';


@NgModule({
  declarations: [
    RevaluationStudentMakePaymentComponent
  ],
  imports: [
    CommonModule,
    RevaluationStudentMakePaymentRoutingModule
  ]
})
export class RevaluationStudentMakePaymentModule { }
