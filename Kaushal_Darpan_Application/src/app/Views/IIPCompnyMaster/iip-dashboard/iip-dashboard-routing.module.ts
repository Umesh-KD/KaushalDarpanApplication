import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IipDashboardComponent } from './iip-dashboard.component';

const routes: Routes = [{ path: '', component: IipDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IipDashboardRoutingModule { }
