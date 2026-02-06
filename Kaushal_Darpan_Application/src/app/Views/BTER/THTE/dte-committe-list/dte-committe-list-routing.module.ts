import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DTECommitteListComponent } from './dte-committe-list.component';

const routes: Routes = [{ path: '', component: DTECommitteListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DTECommitteListRoutingModule { }
