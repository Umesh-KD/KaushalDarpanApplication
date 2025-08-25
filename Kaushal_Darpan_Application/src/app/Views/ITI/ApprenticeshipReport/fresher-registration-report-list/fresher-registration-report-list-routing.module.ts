import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { fresherRegistrationReportListComponent } from './fresher-registration-report-list.component';

const routes: Routes = [{ path: '', component: fresherRegistrationReportListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class fresherRegistrationReportListRoutingModule { }
