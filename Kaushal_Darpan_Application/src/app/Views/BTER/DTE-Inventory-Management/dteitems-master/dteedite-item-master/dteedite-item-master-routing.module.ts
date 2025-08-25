import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DteEditeItemMasterComponent } from './dteedite-item-master.component';

const routes: Routes = [{ path: '', component: DteEditeItemMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DteEditeItemMasterRoutingModule { }
