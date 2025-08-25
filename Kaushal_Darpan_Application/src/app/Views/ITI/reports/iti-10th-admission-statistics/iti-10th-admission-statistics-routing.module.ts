import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Iti10ThAddmissionStatisticsComponent } from './iti-10th-admission-statistics.component';

const routes: Routes = [{ path: '', component: Iti10ThAddmissionStatisticsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Iti10ThAddmissionStatisticsRoutingModule { }
