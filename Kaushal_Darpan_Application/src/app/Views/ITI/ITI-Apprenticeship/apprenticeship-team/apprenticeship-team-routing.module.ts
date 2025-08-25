import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprenticeshipTeamComponent } from './apprenticeship-team.component';

const routes: Routes = [{ path: '', component: ApprenticeshipTeamComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprenticeshipTeamRoutingModule { }
