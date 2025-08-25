import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbcIdStudentDetailsComponent } from './abc-id-student-details.component';


const routes: Routes = [{ path: '', component: AbcIdStudentDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbcIdStudentDetailsRoutingModule { }
