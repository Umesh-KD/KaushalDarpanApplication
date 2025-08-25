import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddItiHrMasterComponent } from './add-itihr-master.component';



const routes: Routes = [{ path: '', component: AddItiHrMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddItiHrmasterRoutingModule { }
