import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryDashboardReportComponent } from './InventoryDashboardReport.component';



const routes: Routes = [{ path: '', component:InventoryDashboardReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryDashboardReportRoutingModule { }


