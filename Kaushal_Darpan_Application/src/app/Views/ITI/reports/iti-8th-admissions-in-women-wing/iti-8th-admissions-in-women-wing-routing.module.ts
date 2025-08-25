import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Iti8ThAdmissionsInWomenWingComponent } from './iti-8th-admissions-in-women-wing.component';

const routes: Routes = [{ path: '', component: Iti8ThAdmissionsInWomenWingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Iti8ThAdmissionsInWomenWingRoutingModule { }
