import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PrincipleDashboardComponent } from './principle-dashboard.component';


const routes: Routes = [{ path: '', component: PrincipleDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipleDashboardRoutingModule { }
