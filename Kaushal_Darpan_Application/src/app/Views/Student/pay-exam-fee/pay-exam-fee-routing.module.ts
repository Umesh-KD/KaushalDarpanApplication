import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayExamFeeComponent } from './pay-exam-fee.component';

const routes: Routes = [{ path: '', component: PayExamFeeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayExamFeeRoutingModule { }
