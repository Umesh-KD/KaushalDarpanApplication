import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentPlacementMappingComponent } from './student-placement-mapping.component';

const routes: Routes = [{ path: '', component: StudentPlacementMappingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentPlacementMappingRoutingModule { }
