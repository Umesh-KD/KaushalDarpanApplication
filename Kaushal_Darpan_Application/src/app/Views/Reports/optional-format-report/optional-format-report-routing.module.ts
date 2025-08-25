import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OptionalFormatReportComponent } from './optional-format-report.component';

const routes: Routes = [{ path: '', component: OptionalFormatReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OptionalFormatReportRoutingModule { }
