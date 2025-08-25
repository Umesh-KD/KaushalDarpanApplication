import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITICollegeAdmissionComponent } from './iticollege-admission.component';

const routes: Routes = [{ path: '', component: ITICollegeAdmissionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITICollegeAdmissionRoutingModule { }
