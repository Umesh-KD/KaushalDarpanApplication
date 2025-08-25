import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiCenterObserverDeploymentComponent } from './iti-center-observer-deployment.component';

const routes: Routes = [{ path: '', component: ItiCenterObserverDeploymentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiCenterObserverDeploymentRoutingModule { }
