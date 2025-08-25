import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DteReturnItemsListComponent } from './dtereturn-items-list.component';






const routes: Routes = [{ path: '', component: DteReturnItemsListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DteReturnItemsListRoutingModule { }
