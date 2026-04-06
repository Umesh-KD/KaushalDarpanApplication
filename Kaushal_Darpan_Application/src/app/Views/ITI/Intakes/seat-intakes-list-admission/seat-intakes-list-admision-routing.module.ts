import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeatIntakesListAdmissionComponent } from './seat-intakes-list-admision.component';

const routes: Routes = [{ path: '', component: SeatIntakesListAdmissionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeatIntakesListAdmissionRoutingModule { }
