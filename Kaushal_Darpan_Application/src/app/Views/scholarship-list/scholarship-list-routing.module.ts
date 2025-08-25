import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScholarshipListComponent } from './scholarship-list.component';

const routes: Routes = [{ path: '', component: ScholarshipListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScholarshipListRoutingModule { }
