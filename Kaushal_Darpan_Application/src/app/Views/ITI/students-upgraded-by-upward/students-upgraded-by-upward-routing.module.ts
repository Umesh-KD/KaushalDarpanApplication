import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentUpgradedByUpwardComponent } from './students-upgraded-by-upward.component';

const routes: Routes = [{ path: '', component: StudentUpgradedByUpwardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentUpgradedByUpwardRoutingModule { }
