import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSeatMetrixComponent } from './list-seat-metrix.component';

const routes: Routes = [{ path: '', component: ListSeatMetrixComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListSeatMetrixRoutingModule { }
