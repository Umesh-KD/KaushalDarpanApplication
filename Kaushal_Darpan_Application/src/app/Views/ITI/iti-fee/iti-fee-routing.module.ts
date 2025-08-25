import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIFeeComponent } from './iti-fee.component';

const routes: Routes = [{ path: '', component: ITIFeeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class ItiFeeRoutingModule { }
