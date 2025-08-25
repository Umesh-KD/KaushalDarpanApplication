import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinalAdmissionComponent } from './final-admission.component';

const routes: Routes = [{ path: '', component: FinalAdmissionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinalAdmissionRoutingModule { }
