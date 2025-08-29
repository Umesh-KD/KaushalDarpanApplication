import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NcvtDataBulkUploadComponent } from './ncvt-data-bulk-upload.component';

const routes: Routes = [{ path: '', component: NcvtDataBulkUploadComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NcvtDataBulkUploadRoutingModule { }
