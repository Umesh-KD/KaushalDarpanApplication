import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollegeLoginInfoMasterComponent } from './college-login-info-master.component';

const routes: Routes = [{ path: '', component: CollegeLoginInfoMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollegeLoginInfoMasterRoutingModule { }
