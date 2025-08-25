import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyCenterObserverDeploymentComponent } from './verify-center-observer-deployment.component';

const routes: Routes = [{ path: '', component: VerifyCenterObserverDeploymentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifyCenterObserverDeploymentRoutingModule { }
