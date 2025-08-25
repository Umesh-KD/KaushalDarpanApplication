import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DteCategoriesMasterComponent } from './dtecategories-master.component';





const routes: Routes = [{ path: '', component: DteCategoriesMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DteCategoriesMasterRoutingModule { }
