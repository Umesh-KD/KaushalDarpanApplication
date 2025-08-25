import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternalPracticalAssesmentComponent } from './internal-practical-assesment.component';

const routes: Routes = [{ path: '', component: InternalPracticalAssesmentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternalPracticalAssesmentRoutingModule { }
