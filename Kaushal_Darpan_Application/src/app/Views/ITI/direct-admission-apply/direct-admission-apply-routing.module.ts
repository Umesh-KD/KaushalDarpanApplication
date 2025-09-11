import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirectAdmissionApplyComponent } from './direct-admission-apply.component';

const routes: Routes = [{ path: '', component: DirectAdmissionApplyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectAdmissionApplyRoutingModule { }
