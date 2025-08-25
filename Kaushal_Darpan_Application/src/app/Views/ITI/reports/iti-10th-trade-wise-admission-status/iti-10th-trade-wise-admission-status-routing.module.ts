import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Iti10ThTradeWiseAdmissionStatusComponent } from './iti-10th-trade-wise-admission-status.component';

const routes: Routes = [{ path: '', component: Iti10ThTradeWiseAdmissionStatusComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Iti10ThTradeWiseAdmissionStatusRoutingModule { }
