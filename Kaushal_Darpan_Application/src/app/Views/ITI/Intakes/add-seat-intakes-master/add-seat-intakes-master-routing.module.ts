import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSeatIntakesMasterComponent } from './add-seat-intakes-master.component';

const routes: Routes = [{ path: '', component: AddSeatIntakesMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddSeatIntakesMasterRoutingModule { }
