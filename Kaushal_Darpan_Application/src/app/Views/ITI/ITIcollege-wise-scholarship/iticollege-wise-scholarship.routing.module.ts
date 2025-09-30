import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ITICollegeWiseScholarshipComponent } from './iticollege-wise-scholarship.component';





const routes: Routes = [{ path: '', component: ITICollegeWiseScholarshipComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITICollegeWiseScholarshipRoutingModule { }
