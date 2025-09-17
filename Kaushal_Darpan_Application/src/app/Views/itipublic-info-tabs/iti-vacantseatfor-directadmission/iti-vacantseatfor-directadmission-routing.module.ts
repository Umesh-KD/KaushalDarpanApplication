import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiVacantSeatDirectAdmissionComponent } from './iti-vacantseatfor-directadmission.component';

const routes: Routes = [{ path: '', component: ItiVacantSeatDirectAdmissionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiVacantSeatDirectAdmissionRoutingModule { }
