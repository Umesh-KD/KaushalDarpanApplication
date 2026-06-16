import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryItemReportComponent } from './inventory-item-report.component';

const routes: Routes = [{ path: '', component: InventoryItemReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryItemReportRoutingModule { }
