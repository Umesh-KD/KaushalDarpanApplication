import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Iti10ThAdmissionsInWomenWingComponent } from './iti-10th-admissions-in-women-wing.component';

const routes: Routes = [{ path: '', component: Iti10ThAdmissionsInWomenWingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Iti10ThAdmissionsInWomenWingRoutingModule { }
