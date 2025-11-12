import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddIntakePlanningComponent } from './add-intake-planning.component';

const routes: Routes = [{ path: '', component: AddIntakePlanningComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddIntakePlanningRoutingModule { }
