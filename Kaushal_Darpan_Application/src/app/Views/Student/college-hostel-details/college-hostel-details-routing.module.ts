import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollegeHostelDetailsComponent } from './CollegeHostelDetailsComponent';

const routes: Routes = [{ path: '', component: CollegeHostelDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollegeHostelDetailsRoutingModule { }
