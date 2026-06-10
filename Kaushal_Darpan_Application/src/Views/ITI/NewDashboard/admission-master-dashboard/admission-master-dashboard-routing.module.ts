import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmissionMasterDashboardComponent } from './admission-master-dashboard.component';

const routes: Routes = [{ path: '', component: AdmissionMasterDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmissionMasterDashboardRoutingModule { }
