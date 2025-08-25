import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BTERSeatMetrixListComponent } from './list-seat-metrix.component';

const routes: Routes = [{ path: '', component: BTERSeatMetrixListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BTERSeatMetrixListRoutingModule { }
