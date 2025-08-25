import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternalPracticalStudentComponent } from './internal-practical-student.component';




const routes: Routes = [{ path: '', component: InternalPracticalStudentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternalPracticalStudentRoutingModule { }
