import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiCenterAllotmentComponent } from './iti-center-allotment.component';

const routes: Routes = [{ path: '', component: ItiCenterAllotmentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiCenterAllotmentRoutingModule { }
