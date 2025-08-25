import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSeatsDistributionsComponent } from './add-seats-distributions.component';

const routes: Routes = [{ path: '', component: AddSeatsDistributionsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddSeatsDistributionsRoutingModule { }
