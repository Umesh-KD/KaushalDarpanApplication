import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollegeRollListAdmitCardComponent } from './college-roll-list-admit-card.component';

const routes: Routes = [{ path: '', component: CollegeRollListAdmitCardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollegeRollListAdmitCardRoutingModule { }
