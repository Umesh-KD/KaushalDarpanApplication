import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { bterCollegeSearchComponent } from './bter-college-search.component';

const routes: Routes = [{ path: '', component: bterCollegeSearchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class bterCollegeSearchRoutingModule { }
