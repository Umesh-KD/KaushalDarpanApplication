import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DteAddItemsMasterComponent } from './dteadd-items-master.component';






const routes: Routes = [{ path: '', component: DteAddItemsMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DteAddItemsMasterRoutingModule { }

