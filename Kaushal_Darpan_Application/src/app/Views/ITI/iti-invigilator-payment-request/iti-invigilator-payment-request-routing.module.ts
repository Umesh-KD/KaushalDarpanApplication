import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIInvigilatorPaymentRequestComponent } from './iti-invigilator-payment-request.component';

const routes: Routes = [{ path: '', component: ITIInvigilatorPaymentRequestComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIInvigilatorPaymentRequestRoutingModule { }
