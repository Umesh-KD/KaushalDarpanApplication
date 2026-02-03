import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JDTEDashboardComponent } from './jdte-dashboard.component';


const routes: Routes = [{ path: '', component: JDTEDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JDTEDashboardRoutingModule { }
