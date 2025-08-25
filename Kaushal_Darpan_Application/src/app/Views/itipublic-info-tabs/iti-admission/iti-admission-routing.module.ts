import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiAdmissionComponent } from './iti-admission.component';

const routes: Routes = [{ path: '', component: ItiAdmissionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiAdmissionRoutingModule { }
