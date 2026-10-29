import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsolatedDashboardComponent } from './consolated-dashboard.component';

const routes: Routes = [{ path: '', component: ConsolatedDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsolatedDashboardRoutingModule { }
