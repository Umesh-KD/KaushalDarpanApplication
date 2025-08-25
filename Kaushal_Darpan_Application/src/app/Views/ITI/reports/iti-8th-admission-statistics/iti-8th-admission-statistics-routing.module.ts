import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Iti8ThAddmissionStatisticsComponent } from './iti-8th-admission-statistics.component';

const routes: Routes = [{ path: '', component: Iti8ThAddmissionStatisticsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Iti8ThAddmissionStatisticsRoutingModule { }
