import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DteLaboratoryMasterComponent } from './dtelaboratory-master.component';






const routes: Routes = [{ path: '', component: DteLaboratoryMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DteLaboratoryMasterRoutingModule { }
