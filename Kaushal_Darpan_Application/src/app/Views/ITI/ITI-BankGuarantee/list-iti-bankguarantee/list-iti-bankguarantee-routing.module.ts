import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { listitibankguaranteeComponent } from './list-iti-bankguarantee.component';

const routes: Routes = [{ path: '', component: listitibankguaranteeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class listitibankguaranteeRoutingModule { }
