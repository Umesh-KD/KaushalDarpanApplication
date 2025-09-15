import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExtraOrdinaryLeavesForStaffComponent } from './ExtraOrdinaryLeavesForStaff.component';

const routes: Routes = [{ path: '', component: ExtraOrdinaryLeavesForStaffComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtraOrdinaryLeavesForStaffRoutingModule { }
