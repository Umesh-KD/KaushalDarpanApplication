import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIEstablishmentDashboardComponent } from './iti-establishment-dashboard.component';

const routes: Routes = [{ path: '', component: ITIEstablishmentDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIEstablishmentDashboardRoutingModule { }
