import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScvtCenterAllocationComponent } from './scvt-center-allocation.component';

const routes: Routes = [{ path: '', component: ScvtCenterAllocationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScvtCenterAllocationRoutingModule { }
