import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeatDataListComponent } from './seat-datalist.component';

const routes: Routes = [{ path: '', component: SeatDataListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeatDataListRoutingModule { }
