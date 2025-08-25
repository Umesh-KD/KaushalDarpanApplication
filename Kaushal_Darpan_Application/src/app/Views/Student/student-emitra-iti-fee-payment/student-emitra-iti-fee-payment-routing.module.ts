import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentEmitraITIFeePaymentComponent } from './student-emitra-iti-fee-payment.component';

const routes: Routes = [{ path: '', component: StudentEmitraITIFeePaymentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentEmitraITIFeePaymentRoutingModule { }
