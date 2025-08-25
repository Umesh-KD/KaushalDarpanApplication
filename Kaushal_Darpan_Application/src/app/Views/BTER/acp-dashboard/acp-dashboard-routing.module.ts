import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ACPDashboardComponent } from './acp-dashboard.component';

const routes: Routes = [{ path: '', component: ACPDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ACPDashboardRoutingModule { }
