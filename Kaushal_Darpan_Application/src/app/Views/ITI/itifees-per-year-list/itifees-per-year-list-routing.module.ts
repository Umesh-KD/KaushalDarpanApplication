import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIFeesPerYearListComponent } from './itifees-per-year-list.component';

const routes: Routes = [{ path: '', component: ITIFeesPerYearListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIFeesPerYearListRoutingModule { }
