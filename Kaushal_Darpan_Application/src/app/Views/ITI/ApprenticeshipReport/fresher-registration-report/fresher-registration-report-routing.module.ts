import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { fresherRegistrationReportComponent } from './fresher-registration-report.component';

const routes: Routes = [{ path: '', component: fresherRegistrationReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class fresherRegistrationReportRoutingModule { }
