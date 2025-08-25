import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentCenteredActivitesMasterComponent } from './student-centered-activites-master.component';

const routes: Routes = [{ path: '', component: StudentCenteredActivitesMasterComponent }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentCenteredActivitesRoutingModule { }
