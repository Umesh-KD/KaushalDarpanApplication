import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamNodalMappingComponent } from './exam-nodal-mapping.component';

const routes: Routes = [{ path: '', component: ExamNodalMappingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamNodalMappingRoutingModule { }
