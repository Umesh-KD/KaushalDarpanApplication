import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPostPlanningComponent } from './add-post-planning.component';

const routes: Routes = [{ path: '', component: AddPostPlanningComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddPostPlanningRoutingModule { }
