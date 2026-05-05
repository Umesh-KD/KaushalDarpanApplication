import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiExaminationInchargeDashboardComponent } from './iti-examination-incharge-dashboard.component';

const routes: Routes = [{ path: '', component: ItiExaminationInchargeDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiExaminationInchargeDashboardRoutingModule { }
