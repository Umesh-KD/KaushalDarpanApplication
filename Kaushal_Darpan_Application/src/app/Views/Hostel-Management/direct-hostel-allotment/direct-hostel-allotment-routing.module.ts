import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirectHostelAllotmentComponent } from './direct-hostel-allotment.component';

const routes: Routes = [{ path: '', component: DirectHostelAllotmentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectHostelAllotmentRoutingModule { }
