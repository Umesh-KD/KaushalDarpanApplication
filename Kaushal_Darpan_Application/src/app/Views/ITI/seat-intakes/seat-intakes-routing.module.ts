import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeatIntakesComponent } from './seat-intakes.component';

const routes: Routes = [{ path: '', component: SeatIntakesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeatIntakesRoutingModule { }
