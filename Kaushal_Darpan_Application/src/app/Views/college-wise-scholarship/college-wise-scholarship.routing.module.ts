import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CollegeWiseScholarshipComponent } from './college-wise-scholarship.component';





const routes: Routes = [{ path: '', component: CollegeWiseScholarshipComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollegeWiseScholarshipRoutingModule { }
