import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTimeTableComponent } from './add-time-table.component';

const routes: Routes = [{ path: '', component: AddTimeTableComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddTimeTableRoutingModule { }
