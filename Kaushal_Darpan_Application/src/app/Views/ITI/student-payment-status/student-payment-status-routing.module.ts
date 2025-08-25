import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentPaymentStatusComponent } from './student-payment-status.component';

const routes: Routes = [{ path: '', component: StudentPaymentStatusComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentPaymentStatusRoutingModule { }
