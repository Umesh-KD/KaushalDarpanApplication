import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentSectionInchargeComponent } from './student-section-incharge.component';

const routes: Routes = [{ path: '', component: StudentSectionInchargeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentSectionInchargeRoutingModule { }
