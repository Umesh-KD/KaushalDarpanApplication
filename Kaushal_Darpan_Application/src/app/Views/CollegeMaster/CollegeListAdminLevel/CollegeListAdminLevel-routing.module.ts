import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollegeListAdminLevelComponent } from './CollegeListAdminLevel.component';


const routes: Routes = [{ path: '', component: CollegeListAdminLevelComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollegeMasterRoutingModule { }
