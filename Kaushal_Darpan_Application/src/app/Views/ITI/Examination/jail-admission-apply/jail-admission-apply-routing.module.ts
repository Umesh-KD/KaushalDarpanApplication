import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JailAdmissionApplyComponent } from './jail-admission-apply.component';

const routes: Routes = [{ path: '', component: JailAdmissionApplyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JailAdmissionApplyRoutingModule { }
