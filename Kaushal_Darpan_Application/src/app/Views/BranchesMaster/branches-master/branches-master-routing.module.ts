import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchesMasterComponent } from './branches-master.component';

const routes: Routes = [{ path: '', component: BranchesMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchesMasterRoutingModule { }
