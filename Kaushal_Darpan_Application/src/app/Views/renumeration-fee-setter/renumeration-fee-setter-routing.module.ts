import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RenumerationFeeSetterComponent } from './renumeration-fee-setter.component';

const routes: Routes = [{ path: '', component: RenumerationFeeSetterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RenumerationFeeSetterRoutingModule { }
