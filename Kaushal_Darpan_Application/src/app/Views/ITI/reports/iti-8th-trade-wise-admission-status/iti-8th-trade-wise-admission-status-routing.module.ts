import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Iti8ThTradeWiseAdmissionStatusComponent } from './iti-8th-trade-wise-admission-status.component';

const routes: Routes = [{ path: '', component: Iti8ThTradeWiseAdmissionStatusComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Iti8ThTradeWiseAdmissionStatusRoutingModule { }
