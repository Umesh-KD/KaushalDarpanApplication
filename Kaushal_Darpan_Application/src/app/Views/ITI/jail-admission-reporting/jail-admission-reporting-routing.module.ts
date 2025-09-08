import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JailAdmissionReportingComponent } from './jail-admission-reporting.component';

const routes: Routes = [{ path: '', component: JailAdmissionReportingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JailAdmissionReportingRoutingModule { }
