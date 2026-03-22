import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScholarshipGetDataComponent } from './scholarship-get-data.component';

const routes: Routes = [{ path: '', component: ScholarshipGetDataComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScholarshipGetDataRoutingModule { }
