import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequiredTradeItemsReportComponent } from './required-trade-items-report.component';

const routes: Routes = [{ path: '', component: RequiredTradeItemsReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequiredTradeItemsReportRoutingModule { }
