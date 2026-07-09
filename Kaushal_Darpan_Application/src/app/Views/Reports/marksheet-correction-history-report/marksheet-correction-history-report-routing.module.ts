import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarksheetCorrectionHistoryReportComponent } from './marksheet-correction-history-report.component';

const routes: Routes = [{ path: '', component: MarksheetCorrectionHistoryReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarksheetCorrectionHistoryReportRoutingModule { }
