import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentCorrectionMasterComponent } from './student-correction-master.component';





const routes: Routes = [{ path: '', component: StudentCorrectionMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentCorrectionMasterRoutingModule { }
