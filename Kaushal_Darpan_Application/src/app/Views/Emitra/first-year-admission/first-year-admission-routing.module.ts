import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirstYearAdmissionComponent } from './first-year-admission.component';

const routes: Routes = [{ path: '', component: FirstYearAdmissionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FirstYearAdmissionRoutingModule { }
