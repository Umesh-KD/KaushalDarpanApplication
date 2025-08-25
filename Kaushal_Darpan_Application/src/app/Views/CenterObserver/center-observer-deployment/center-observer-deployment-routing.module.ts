import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CenterObserverDeploymentComponent } from './center-observer-deployment.component';

const routes: Routes = [{ path: '', component: CenterObserverDeploymentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CenterObserverDeploymentRoutingModule { }
