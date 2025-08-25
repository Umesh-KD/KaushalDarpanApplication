import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirectAllotmentListComponent } from './direct-allotment-list.component';


const routes: Routes = [{ path: '', component: DirectAllotmentListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectAllotmentListRoutingModule { }
