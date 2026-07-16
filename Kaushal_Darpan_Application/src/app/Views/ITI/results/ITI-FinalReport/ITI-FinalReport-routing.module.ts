import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIFinalReportComponent } from './ITI-FinalReport.component';

const routes: Routes = [{ path: '', component: ITIFinalReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIFinalReportRoutingModule { }
