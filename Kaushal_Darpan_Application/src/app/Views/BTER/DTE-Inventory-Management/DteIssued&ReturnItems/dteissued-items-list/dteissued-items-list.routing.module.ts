import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DteIssuedItemsListComponent } from './dteissued-items-list.component';






const routes: Routes = [{ path: '', component: DteIssuedItemsListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DteIssuedItemsListRoutingModule { }
