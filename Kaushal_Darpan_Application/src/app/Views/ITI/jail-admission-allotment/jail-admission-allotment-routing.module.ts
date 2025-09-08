import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JailAdmissionAllotmentComponent } from './jail-admission-allotment.component';

const routes: Routes = [{ path: '', component: JailAdmissionAllotmentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JailAdmissionAllotmentRoutingModule { }
