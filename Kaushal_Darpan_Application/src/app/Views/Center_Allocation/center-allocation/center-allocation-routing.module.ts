import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CenterAllocationComponent } from './center-allocation.component';

const routes: Routes = [{ path: '', component: CenterAllocationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CenterAllocationRoutingModule { }
