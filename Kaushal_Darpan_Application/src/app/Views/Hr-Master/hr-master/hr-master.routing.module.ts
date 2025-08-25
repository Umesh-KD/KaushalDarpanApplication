import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrMasterComponent } from './hr-master.component';




const routes: Routes = [{ path: '', component: HrMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrmasterRoutingModule { }
