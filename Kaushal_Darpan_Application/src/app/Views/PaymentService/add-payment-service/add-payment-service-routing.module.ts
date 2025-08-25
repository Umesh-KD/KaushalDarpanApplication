import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPaymentServiceComponent } from './add-payment-service.component';

const routes: Routes = [{ path: '', component: AddPaymentServiceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddPaymentServiceRoutingModule { }
