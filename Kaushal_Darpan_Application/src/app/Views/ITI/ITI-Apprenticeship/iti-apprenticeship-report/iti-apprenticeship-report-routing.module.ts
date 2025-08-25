import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIApprenticeshipReportComponent } from './iti-apprenticeship-report.component';

const routes: Routes = [{ path: '', component: ITIApprenticeshipReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIApprenticeshipReportRoutingModule { }
