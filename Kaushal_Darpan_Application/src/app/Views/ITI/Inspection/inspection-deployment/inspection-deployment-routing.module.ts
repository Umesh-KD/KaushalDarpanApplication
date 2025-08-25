import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InspectionDeploymentComponent } from './inspection-deployment.component';

const routes: Routes = [{ path: '', component: InspectionDeploymentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionDeploymentRoutingModule { }
