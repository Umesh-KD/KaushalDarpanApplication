import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { THTECommitteeafterPrincipleApplicationListComponent } from './thte-committee-afterprinciple-application-list.component';

const routes: Routes = [{ path: '', component: THTECommitteeafterPrincipleApplicationListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class THTECommitteeafterPrincipleApplicationListRoutingModule { }
