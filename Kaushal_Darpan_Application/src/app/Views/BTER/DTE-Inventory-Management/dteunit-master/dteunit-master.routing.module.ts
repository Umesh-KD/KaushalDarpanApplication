import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DteUnitMasterComponent } from './dteunit-master.component';





const routes: Routes = [{ path: '', component: DteUnitMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DteUnitMasterRoutingModule { }
