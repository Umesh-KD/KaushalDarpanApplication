import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NodalCenterStatusComponent } from './nodal-center-status.component';

const routes: Routes = [{ path: '', component: NodalCenterStatusComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NodalCenterStatusRoutingModule { }
