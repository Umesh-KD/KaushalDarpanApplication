import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiCollegeUpdateComponent } from './iti-college-update.component';

const routes: Routes = [{ path: '', component: ItiCollegeUpdateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiCollegeUpdateRoutingModule { }
