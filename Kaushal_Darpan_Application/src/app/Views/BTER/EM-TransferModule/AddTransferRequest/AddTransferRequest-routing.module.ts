import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTransferRequestComponent } from './AddTransferRequest.component';


const routes: Routes = [{ path: '', component: AddTransferRequestComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddTransferRequestRoutingModule { }
