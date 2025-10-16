import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { THTECommitteeComponent } from './thte-committee.component';

const routes: Routes = [{ path: '', component: THTECommitteeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class THTECommitteeRoutingModule { }
