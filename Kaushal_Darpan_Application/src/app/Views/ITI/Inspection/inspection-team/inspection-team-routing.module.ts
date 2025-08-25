import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InspectionTeamComponent } from './inspection-team.component';

const routes: Routes = [{ path: '', component: InspectionTeamComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionTeamRoutingModule { }
