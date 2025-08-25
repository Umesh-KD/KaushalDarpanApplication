import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollegePaymentStatusComponent } from './college-payment-status.component';

const routes: Routes = [{ path: '', component: CollegePaymentStatusComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollegePaymentStatusRoutingModule { }
