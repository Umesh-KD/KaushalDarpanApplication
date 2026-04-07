import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InspectionPaymentStatusComponent } from './inpsection-payment-status.component';

const routes: Routes = [{ path: '', component: InspectionPaymentStatusComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionPaymentStatusRoutingModule { }
