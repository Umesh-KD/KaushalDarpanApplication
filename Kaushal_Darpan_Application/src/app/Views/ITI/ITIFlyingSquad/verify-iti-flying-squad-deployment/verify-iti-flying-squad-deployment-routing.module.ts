import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyItiCenterObserverDeploymentComponent } from './verify-iti-flying-squad-deployment.component';

const routes: Routes = [{ path: '', component: VerifyItiCenterObserverDeploymentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifyItiCenterObserverDeploymentRoutingModule { }
