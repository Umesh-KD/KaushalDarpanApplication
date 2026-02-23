import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApproveIssuedItemsComponent } from './approve-issued-items.component';

const routes: Routes = [{ path: '', component: ApproveIssuedItemsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApproveIssuedItemsRoutingModule { }

