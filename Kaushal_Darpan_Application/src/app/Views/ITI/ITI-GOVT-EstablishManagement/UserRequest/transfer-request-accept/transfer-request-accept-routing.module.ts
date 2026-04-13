import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransferRequestAcceptComponent } from './transfer-request-accept.component';

const routes: Routes = [{ path: '', component: TransferRequestAcceptComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferRequestAcceptRoutingModule { }
