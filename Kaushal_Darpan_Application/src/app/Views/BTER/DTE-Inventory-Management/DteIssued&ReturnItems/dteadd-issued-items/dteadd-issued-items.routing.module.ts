import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DteAddIssuedItemsComponent } from './dteadd-issued-items.component';






const routes: Routes = [{ path: '', component: DteAddIssuedItemsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DteAddIssuedItemsRoutingModule { }
