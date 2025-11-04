import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SanctionMasterComponent } from './sanction-master.component';

const routes: Routes = [{ path: '', component: SanctionMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SanctionMasterRoutingModule { }
