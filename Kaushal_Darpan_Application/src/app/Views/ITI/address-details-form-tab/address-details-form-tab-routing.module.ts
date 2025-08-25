import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddressDetailsFormTabComponent } from './address-details-form-tab.component';

const routes: Routes = [{ path: '', component: AddressDetailsFormTabComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddressDetailsFormTabRoutingModule { }
