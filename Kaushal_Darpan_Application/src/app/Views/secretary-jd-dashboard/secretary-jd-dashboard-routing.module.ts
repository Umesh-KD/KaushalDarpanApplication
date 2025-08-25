import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SecretaryJDDashboardComponent } from './secretary-jd-dashboard.component';

const routes: Routes = [{ path: '', component: SecretaryJDDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecretaryJDDashboardRoutingModule { }
