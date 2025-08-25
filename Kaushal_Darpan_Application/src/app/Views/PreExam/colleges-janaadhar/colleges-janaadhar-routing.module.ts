import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollegesJanaadharComponent } from './colleges-janaadhar.component';

const routes: Routes = [{ path: '', component: CollegesJanaadharComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollegesJanaadharRoutingModule { }
