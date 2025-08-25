import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddedGuestHouseComponent } from './added-guest-house.component';

const routes: Routes = [{ path: '', component: AddedGuestHouseComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddedGuestHouseRoutingModule { }
