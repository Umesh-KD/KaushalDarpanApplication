import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamShiftMasterComponent } from './exam-shift-master.component';

const routes: Routes = [{ path: '', component: ExamShiftMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamShiftMasterRoutingModule { }
