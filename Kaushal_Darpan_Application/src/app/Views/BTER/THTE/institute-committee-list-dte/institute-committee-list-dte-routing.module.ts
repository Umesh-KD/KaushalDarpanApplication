import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstituteCommitteeListDTEComponent } from './institute-committee-list-dte.component';

const routes: Routes = [{ path: '', component: InstituteCommitteeListDTEComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstituteCommitteeListDTERoutingModule { }
