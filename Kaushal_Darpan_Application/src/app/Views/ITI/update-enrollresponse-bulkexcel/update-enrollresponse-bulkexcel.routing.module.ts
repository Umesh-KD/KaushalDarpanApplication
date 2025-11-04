import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UpdateEnrollResponseBulkExcelComponent } from './update-enrollresponse-bulkexcel.component';





const routes: Routes = [{ path: '', component: UpdateEnrollResponseBulkExcelComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateEnrollResponseBulkExcelRoutingModule { }
