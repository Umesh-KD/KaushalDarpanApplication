import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITICollegeLoginInfoMasterComponent } from './ITI-CollegeLoginInfoMaster.component';

const routes: Routes = [{ path: '', component: ITICollegeLoginInfoMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITICollegeLoginInfoMasterRoutingModule { }
