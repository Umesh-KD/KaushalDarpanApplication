import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingFeesComponent } from './pending-fees.component';

const routes: Routes = [{ path: '', component: PendingFeesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingFeesRoutingModule { }
