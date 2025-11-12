import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeatIntakePlanningComponent } from './seat-intake-planning.component';

const routes: Routes = [{ path: '', component: SeatIntakePlanningComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeatIntakePlanningRoutingModule { }
