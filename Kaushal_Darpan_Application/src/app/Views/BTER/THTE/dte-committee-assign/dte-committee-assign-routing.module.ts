import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DTECommitteeAssignComponent } from './dte-committee-assign.component';

const routes: Routes = [{ path: '', component: DTECommitteeAssignComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DTECommitteeAssignRoutingModule { }
