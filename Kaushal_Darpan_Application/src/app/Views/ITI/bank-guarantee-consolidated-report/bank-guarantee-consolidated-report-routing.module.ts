import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankGuaranteeConsolidatedReportComponent } from './bank-guarantee-consolidated-report.component';

const routes: Routes = [{ path: '', component: BankGuaranteeConsolidatedReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankGuaranteeConsolidatedReportRoutingModule { }
