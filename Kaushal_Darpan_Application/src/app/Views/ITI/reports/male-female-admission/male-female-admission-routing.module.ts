import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaleFemaleAdmissionComponent } from './male-female-admission.component';

const routes: Routes = [{ path: '', component: MaleFemaleAdmissionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaleFemaleAdmissionComponentRoutingModule { }
