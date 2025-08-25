import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiPromoteStudentComponent } from './iti-promote-student.component';

const routes: Routes = [{ path: '', component: ItiPromoteStudentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiPromoteStudentRoutingModule { }
