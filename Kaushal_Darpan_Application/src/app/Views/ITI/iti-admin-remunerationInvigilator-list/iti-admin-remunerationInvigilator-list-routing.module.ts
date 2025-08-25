import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiAdminremunerationInvigilatorlistComponent } from './iti-admin-remunerationInvigilator-list.component';

const routes: Routes = [{ path: '', component: ItiAdminremunerationInvigilatorlistComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiAdminRemunerationInvigilatorlistRoutingModule { }
