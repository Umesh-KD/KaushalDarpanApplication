import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BterEstablishManagementReportComponent } from './bter-establish-management-report.component';

const routes: Routes = [{ path: '', component: BterEstablishManagementReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BterEstablishManagementReportRoutingModule { }
