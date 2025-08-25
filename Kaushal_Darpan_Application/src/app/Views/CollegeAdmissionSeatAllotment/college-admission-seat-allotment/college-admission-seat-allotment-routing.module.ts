import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollegeAdmissionSeatAllotmentComponent } from './college-admission-seat-allotment.component';


const routes: Routes = [{ path: '', component: CollegeAdmissionSeatAllotmentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollegeAdmissionSeatAllotmentRoutingModule { }
