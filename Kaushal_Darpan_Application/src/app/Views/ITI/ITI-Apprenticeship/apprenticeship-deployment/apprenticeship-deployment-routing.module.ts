import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprenticeshipDeploymentComponent } from './apprenticeship-deployment.component';

const routes: Routes = [{ path: '', component: ApprenticeshipDeploymentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprenticeshipDeploymentRoutingModule { }
