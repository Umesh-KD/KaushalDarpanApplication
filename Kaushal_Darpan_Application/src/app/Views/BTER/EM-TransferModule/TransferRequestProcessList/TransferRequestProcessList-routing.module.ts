import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransferRequestProcessListComponent } from './TransferRequestProcessList.component';

const routes: Routes = [{ path: '', component: TransferRequestProcessListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferRequestProcessListRoutingModule { }
