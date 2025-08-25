import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NonElectiveFormFillingReportComponent } from './non-elective-form-filling-report.component';

const routes: Routes = [{ path: '', component: NonElectiveFormFillingReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NonElectiveFormFillingReportRoutingModule { }
