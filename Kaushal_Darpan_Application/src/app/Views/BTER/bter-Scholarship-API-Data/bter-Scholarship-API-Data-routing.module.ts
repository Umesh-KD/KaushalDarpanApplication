import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { bterScholarshipAPIDataComponent } from './bter-Scholarship-API-Data.component';

const routes: Routes = [{ path: '', component: bterScholarshipAPIDataComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class bterScholarshipAPIDataRoutingModule { }
