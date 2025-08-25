import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromotedStudentComponent } from './promoted-student.component';

const routes: Routes = [{ path: '', component: PromotedStudentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotedStudentRoutingModule { }
