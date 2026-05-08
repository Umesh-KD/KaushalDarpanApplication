import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RelievingTransferListComponent } from './RelievingTransferList.component';

const routes: Routes = [{ path: '', component: RelievingTransferListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RelievingTransferListRoutingModule { }
