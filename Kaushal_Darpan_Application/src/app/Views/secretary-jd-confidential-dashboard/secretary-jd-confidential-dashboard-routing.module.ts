import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SecretaryJdConfidentialDashboardComponent } from './secretary-jd-confidential-dashboard.component';

const routes: Routes = [{ path: '', component: SecretaryJdConfidentialDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecretaryJdConfidentialDashboardRoutingModule { }
