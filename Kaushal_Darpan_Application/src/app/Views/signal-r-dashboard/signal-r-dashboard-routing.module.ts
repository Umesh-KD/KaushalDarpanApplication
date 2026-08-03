import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignalRDashboardComponent } from './signal-r-dashboard.component';

const routes: Routes = [{ path: '', component: SignalRDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignalRDashboardRoutingModule { }
