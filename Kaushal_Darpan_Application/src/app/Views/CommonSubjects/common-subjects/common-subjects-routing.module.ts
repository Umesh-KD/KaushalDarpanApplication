import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonSubjectsComponent } from './common-subjects.component';

const routes: Routes = [{ path: '', component: CommonSubjectsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonSubjectsRoutingModule { }
