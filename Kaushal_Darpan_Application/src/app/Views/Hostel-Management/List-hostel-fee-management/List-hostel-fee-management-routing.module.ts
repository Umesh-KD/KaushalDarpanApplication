import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListhostelfeemanagementComponent } from './List-hostel-fee-management.component';

const routes: Routes = [{ path: '', component: ListhostelfeemanagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListhostelfeemanagementRoutingModule { }
