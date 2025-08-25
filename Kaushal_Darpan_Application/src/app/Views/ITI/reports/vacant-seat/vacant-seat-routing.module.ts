import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VacantSeatComponent } from './vacant-seat.component';

const routes: Routes = [{ path: '', component: VacantSeatComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VacantSeatRoutingModule { }
