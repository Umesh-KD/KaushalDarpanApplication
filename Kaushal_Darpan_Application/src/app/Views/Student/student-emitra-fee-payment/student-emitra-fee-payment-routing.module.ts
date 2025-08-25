import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentEmitraFeePaymentComponent } from './student-emitra-fee-payment.component';

const routes: Routes = [{ path: '', component: StudentEmitraFeePaymentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentEmitraFeePaymentRoutingModule { }
