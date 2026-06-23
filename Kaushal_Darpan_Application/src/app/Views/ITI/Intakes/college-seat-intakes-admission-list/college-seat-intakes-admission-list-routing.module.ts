import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollegeSeatIntakesAdmissionListComponent } from './college-seat-intakes-admission-list.component';

const routes: Routes = [{ path: '', component: CollegeSeatIntakesAdmissionListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollegeSeatIntakesAdmissionListRoutingModule { }
