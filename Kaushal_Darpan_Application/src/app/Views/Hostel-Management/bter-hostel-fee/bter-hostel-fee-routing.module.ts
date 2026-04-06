import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BterHostelFeeComponent } from './bter-hostel-fee.component';


const routes: Routes = [{ path: '', component: BterHostelFeeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BterHostelFeeRoutingModule { }
