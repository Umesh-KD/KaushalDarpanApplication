import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IIPEventConsentReportComponent } from './iip-event-consent-report.component';

const routes: Routes = [{ path: '', component: IIPEventConsentReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IIPEventConsentReportRoutingModule { }
