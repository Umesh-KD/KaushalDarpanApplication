import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiAdminremunerationInvigilatorDetailsComponent } from './iti-admin-remunerationInvigilator-details.component';

const routes: Routes = [{ path: '', component: ItiAdminremunerationInvigilatorDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiAdminRemunerationInvigilatorDetailsRoutingModule { }
