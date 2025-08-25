import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiCollegeSearchComponent } from './iti-college-search.component';

const routes: Routes = [{ path: '', component:ItiCollegeSearchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiCollegeSearchRoutingModule { }
