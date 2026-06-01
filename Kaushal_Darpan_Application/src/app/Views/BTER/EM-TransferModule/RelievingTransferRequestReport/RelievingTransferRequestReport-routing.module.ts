import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RelievingTransferRequestReportComponent } from './RelievingTransferRequestReport.component';

const routes: Routes = [{ path: '', component: RelievingTransferRequestReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RelievingTransferRequestReportRoutingModule { }
