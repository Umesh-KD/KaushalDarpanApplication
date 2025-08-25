import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HostelMeritlistComponent } from './HostelMerit-list.component';

const routes: Routes = [{ path: '', component: HostelMeritlistComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HostelMeritlistRoutingModule { }
