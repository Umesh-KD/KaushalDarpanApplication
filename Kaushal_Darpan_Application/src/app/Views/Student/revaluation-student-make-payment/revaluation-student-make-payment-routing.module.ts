import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RevaluationStudentMakePaymentComponent } from './revaluation-student-make-payment.component';

const routes: Routes = [{ path: '', component: RevaluationStudentMakePaymentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RevaluationStudentMakePaymentRoutingModule { }
