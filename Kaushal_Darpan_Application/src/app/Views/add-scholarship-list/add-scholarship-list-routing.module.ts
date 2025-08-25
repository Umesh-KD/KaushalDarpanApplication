import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddScholarshipListComponent } from './add-scholarship-list.component';

const routes: Routes = [{ path: '', component: AddScholarshipListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddScholarshipListRoutingModule { }
