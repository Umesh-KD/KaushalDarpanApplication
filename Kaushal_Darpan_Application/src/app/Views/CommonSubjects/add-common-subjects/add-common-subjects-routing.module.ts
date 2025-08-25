import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCommonSubjectsComponent } from './add-common-subjects.component';

const routes: Routes = [{ path: '', component: AddCommonSubjectsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCommonSubjectsRoutingModule { }
