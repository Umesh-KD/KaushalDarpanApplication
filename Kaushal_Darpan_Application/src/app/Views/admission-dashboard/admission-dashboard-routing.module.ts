import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmissionDashboardComponent } from './admission-dashboard.component';

const routes: Routes = [{ path: '', component: AdmissionDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmissionDashboardRoutingModule { }
