import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BridgeCourseComponent } from './bridge-course.component';

const routes: Routes = [{ path: '', component: BridgeCourseComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BridgeCourseRoutingModule { }
