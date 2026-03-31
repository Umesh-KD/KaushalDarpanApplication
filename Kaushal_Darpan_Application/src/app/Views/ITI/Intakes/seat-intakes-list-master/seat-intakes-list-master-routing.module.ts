import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeatIntakesListMasterComponent } from './seat-intakes-list-master.component';

const routes: Routes = [{ path: '', component: SeatIntakesListMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeatIntakesListMasterRoutingModule { }
