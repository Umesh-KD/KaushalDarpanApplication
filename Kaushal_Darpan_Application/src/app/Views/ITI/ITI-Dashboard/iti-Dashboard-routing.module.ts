import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { itiDashboardComponent } from './iti-Dashboard.component';

const routes: Routes = [{ path: '', component: itiDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class itiDashboardRoutingModule { }
