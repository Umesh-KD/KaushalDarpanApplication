import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupcodeAllocationRevalComponent  } from './groupcode-allocation-reval.component';

const routes: Routes = [{ path: '', component: GroupcodeAllocationRevalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupcodeAllocationRevalRoutingModule { }
