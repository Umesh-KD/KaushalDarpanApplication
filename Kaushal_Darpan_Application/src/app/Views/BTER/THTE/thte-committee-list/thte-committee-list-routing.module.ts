import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { THTECommitteeListComponent } from './thte-committee-list.component';

const routes: Routes = [{ path: '', component: THTECommitteeListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class THTECommitteeListRoutingModule { }
