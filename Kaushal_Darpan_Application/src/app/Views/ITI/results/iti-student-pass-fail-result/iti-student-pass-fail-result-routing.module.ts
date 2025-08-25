import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { itiStudentPassFailResultComponent } from './iti-student-pass-fail-result.component';

const routes: Routes = [{ path: '', component: itiStudentPassFailResultComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class itiStudentPassFailResultRoutingModule { }
