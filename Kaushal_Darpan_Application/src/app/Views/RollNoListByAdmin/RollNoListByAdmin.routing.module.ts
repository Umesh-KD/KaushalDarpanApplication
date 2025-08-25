import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { RollNoListByAdminComponent } from './RollNoListByAdmin.component';

const routes: Routes = [{ path: '', component: RollNoListByAdminComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerateRollRoutingModule { }
