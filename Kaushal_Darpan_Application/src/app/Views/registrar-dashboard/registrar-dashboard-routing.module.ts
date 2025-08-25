import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrarDashboardComponent } from './registrar-dashboard.component';

const routes: Routes = [{ path: '', component: RegistrarDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrarDashboardRoutingModule { }
