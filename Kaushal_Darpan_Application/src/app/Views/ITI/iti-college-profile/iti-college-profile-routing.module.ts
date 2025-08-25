import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITICollegeProfileComponent } from './iti-college-profile.component';

const routes: Routes = [{ path: '', component: ITICollegeProfileComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITICollegeProfileRoutingModule { }
