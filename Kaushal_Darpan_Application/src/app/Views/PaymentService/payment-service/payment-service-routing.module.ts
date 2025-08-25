import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentServiceComponent } from './payment-service.component';

const routes: Routes = [{ path: '', component: PaymentServiceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentServiceRoutingModule { }
