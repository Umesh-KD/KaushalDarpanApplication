import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiHrMasterComponent } from './itihr-master.component';




const routes: Routes = [{ path: '', component: ItiHrMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiHrmasterRoutingModule { }
