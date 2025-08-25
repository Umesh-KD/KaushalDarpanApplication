import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiAdminRemunerationDetailsComponent } from './iti-admin-remuneration-details.component';

const routes: Routes = [{ path: '', component: ItiAdminRemunerationDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiAdminRemunerationDetailsRoutingModule { }
