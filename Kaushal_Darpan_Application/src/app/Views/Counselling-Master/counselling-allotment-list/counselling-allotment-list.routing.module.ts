import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {CounsellingAllotmentListComponent } from './counselling-allotment-list.component';





const routes: Routes = [{ path: '', component: CounsellingAllotmentListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CounsellingAllotmentListRoutingModule { }
