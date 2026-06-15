import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ITI_CommanDashboardComponent } from './ITI_CommanDashboard.component';


const routes: Routes = [{ path: '', component: ITI_CommanDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITI_CommanDashboardRoutingModule { }
