import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiPlanningListComponent } from './iti-planning-list.component';

const routes: Routes = [{ path: '', component: ItiPlanningListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiPlanningListRoutingModule { }
