import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditStudentCorrectionMasterComponent } from './edit-student-correction-master.component';





const routes: Routes = [{ path: '', component: EditStudentCorrectionMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditStudentCorrectionMasterRoutingModule { }
