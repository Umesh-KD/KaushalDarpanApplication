import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddExamShiftComponent } from './add-exam-shift.component';

const routes: Routes = [{ path: '', component: AddExamShiftComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddExamShiftRoutingModule { }
