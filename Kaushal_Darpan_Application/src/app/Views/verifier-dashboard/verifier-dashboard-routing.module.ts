import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifierDashboardComponent } from './verifier-dashboard.component';

const routes: Routes = [{ path: '', component: VerifierDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifierDashboardRoutingModule { }
