import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { itiPendingCollegeFeeComponent } from './itiPendingCollegeFee.component';

const routes: Routes = [{ path: '', component: itiPendingCollegeFeeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class itiPendingCollegeFeeRoutingModule { }
