import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirectAdmissionReportComponent } from './direct-admission-report.component';

const routes: Routes = [{ path: '', component: DirectAdmissionReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectAdmissionReportRoutingModule { }
