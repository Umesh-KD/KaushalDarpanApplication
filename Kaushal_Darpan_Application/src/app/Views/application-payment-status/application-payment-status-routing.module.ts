import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationPaymentStatusComponent } from './application-payment-status.component';

const routes: Routes = [{ path: '', component: ApplicationPaymentStatusComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationPaymentStatusRoutingModule { }
