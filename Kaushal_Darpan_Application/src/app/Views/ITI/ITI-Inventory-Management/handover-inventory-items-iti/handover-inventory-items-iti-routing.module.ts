import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HandoverInventoryItemsITIComponent } from './handover-inventory-items-iti.component';

const routes: Routes = [{ path: '', component: HandoverInventoryItemsITIComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HandoverInventoryItemsITIRoutingModule { }
