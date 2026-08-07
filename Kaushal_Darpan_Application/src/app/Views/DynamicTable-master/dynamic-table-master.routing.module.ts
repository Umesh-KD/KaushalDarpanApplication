import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DynamicTableMasterComponent } from './dynamic-table-master.component';





const routes: Routes = [{ path: '', component: DynamicTableMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicTableMasterListRoutingModule { }
