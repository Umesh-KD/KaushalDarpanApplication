import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { reportitibankguaranteeComponent } from './report-iti-bankguarantee.component';

const routes: Routes = [{ path: '', component: reportitibankguaranteeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class reportitibankguaranteeRoutingModule { }
