import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCollegeMasterComponent } from './add-college-master.component';

const routes: Routes = [{ path: '', component: AddCollegeMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCollegeMasterRoutingModule { }
