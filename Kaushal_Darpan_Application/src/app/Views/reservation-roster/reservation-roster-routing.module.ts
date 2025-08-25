import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationRosterComponent } from './reservation-roster.component';

const routes: Routes = [{ path: '', component: ReservationRosterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationRosterRoutingModule { }
