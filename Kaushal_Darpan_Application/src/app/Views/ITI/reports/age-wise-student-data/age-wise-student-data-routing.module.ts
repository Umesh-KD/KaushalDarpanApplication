import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgeStudentDataComponent } from './age-wise-student-data.component';

const routes: Routes = [{ path: '', component: AgeStudentDataComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgeStudentDataRoutingModule { }
