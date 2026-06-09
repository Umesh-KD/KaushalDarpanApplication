import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstablishmentDashboardBTERComponent } from './establishment-dashboard-bter.component';

const routes: Routes = [{ path: '', component: EstablishmentDashboardBTERComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstablishmentDashboardBTERRoutingModule { }
