import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITSupportDashboardComponent } from './it-support-dashboard.component';

const routes: Routes = [{ path: '', component: ITSupportDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITSupportDashboardRoutingModule { }
