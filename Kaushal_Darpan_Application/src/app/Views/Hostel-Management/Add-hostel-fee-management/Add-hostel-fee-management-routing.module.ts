import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddhostelfeemanagementComponent } from './Add-hostel-fee-management.component';

const routes: Routes = [{ path: '', component: AddhostelfeemanagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddhostelfeemanagementRoutingModule { }
