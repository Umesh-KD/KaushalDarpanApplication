import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeatIntakesListComponent } from './seat-intakes-list.component';

const routes: Routes = [{ path: '', component: SeatIntakesListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeatIntakesListRoutingModule { }
