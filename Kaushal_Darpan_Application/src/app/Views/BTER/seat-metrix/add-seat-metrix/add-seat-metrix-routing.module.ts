import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSeatMetrixComponent } from './add-seat-metrix.component';

const routes: Routes = [{ path: '', component: AddSeatMetrixComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddSeatMetrixRoutingModule { }
