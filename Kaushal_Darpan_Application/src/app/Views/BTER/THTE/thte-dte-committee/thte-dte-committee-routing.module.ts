import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { THTEDTECommitteeComponent } from './thte-dte-committee.component';

const routes: Routes = [{ path: '', component: THTEDTECommitteeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class THTEDTECommitteeRoutingModule { }
