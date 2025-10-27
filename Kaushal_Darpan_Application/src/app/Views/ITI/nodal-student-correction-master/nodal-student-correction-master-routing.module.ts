import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NodalStudentCorrectionMasterComponent } from './nodal-student-correction-master.component';

const routes: Routes = [{ path: '', component: NodalStudentCorrectionMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NodalStudentCorrectionMasterRoutingModule { }
