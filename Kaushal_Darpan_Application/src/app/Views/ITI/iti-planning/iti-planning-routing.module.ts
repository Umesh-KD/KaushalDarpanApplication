import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiPlanningComponent } from './iti-planning.component';

const routes: Routes = [{ path: '', component: ItiPlanningComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiPlanningRoutingModule { }
