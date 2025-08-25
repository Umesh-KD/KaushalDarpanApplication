import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminRevalGroupCodeReceivedlistComponent } from './AdminRevalGroupCodeReceived-list.component';

const routes: Routes = [{ path: '', component: AdminRevalGroupCodeReceivedlistComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRevalGroupCodeReceivedlistRoutingModule { }
