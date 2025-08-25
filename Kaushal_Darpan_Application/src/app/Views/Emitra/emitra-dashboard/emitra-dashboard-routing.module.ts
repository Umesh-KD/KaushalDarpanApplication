import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmitraDashboardComponent } from './emitra-dashboard.component';

const routes: Routes = [{ path: '', component: EmitraDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmitraDashboardRoutingModule { }
