import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HostelGenerateMeritlistComponent } from './Hostel-Generate-Merit-list.component';

const routes: Routes = [{ path: '', component: HostelGenerateMeritlistComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HostelGenerateMeritlistRoutingModule { }
