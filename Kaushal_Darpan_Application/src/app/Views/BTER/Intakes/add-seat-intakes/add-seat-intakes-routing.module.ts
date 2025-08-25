import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSeatIntakesComponent } from './add-seat-intakes.component';

const routes: Routes = [{ path: '', component: AddSeatIntakesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddSeatIntakesRoutingModule { }
