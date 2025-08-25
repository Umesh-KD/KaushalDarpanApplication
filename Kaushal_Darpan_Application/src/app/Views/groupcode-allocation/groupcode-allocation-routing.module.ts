import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupcodeAllocationComponent } from './groupcode-allocation.component';

const routes: Routes = [{ path: '', component: GroupcodeAllocationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupcodeAllocationRoutingModule { }
