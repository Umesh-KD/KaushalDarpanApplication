import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddHrMasterComponent } from './add-hr-master.component';


const routes: Routes = [{ path: '', component: AddHrMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddHrmasterRoutingModule { }
