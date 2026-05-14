import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransferRequestReportComponent } from './TransferRequestReport.component';

const routes: Routes = [{ path: '', component: TransferRequestReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferRequestReportRoutingModule { }
