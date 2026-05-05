import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabutarTransferListComponent } from './TabutarTransferList.component';

const routes: Routes = [{ path: '', component: TabutarTransferListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabutarTransferListRoutingModule { }
