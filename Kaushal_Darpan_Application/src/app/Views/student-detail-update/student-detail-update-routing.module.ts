import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentDetailUpdateComponent } from './student-detail-update.component';

const routes: Routes = [{ path: '', component: StudentDetailUpdateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentDetailUpdateRoutingModule { }
