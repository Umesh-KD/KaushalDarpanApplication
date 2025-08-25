import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiCentersuperintendentDashboardComponent } from './iti-centersuperintendent-dashboard.component';

const routes: Routes = [{ path: '', component: ItiCentersuperintendentDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiCentersuperintendentDashboardRoutingModule { }
