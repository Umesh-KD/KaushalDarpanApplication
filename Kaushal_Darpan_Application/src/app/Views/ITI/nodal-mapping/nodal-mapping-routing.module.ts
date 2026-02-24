import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NodalMappingComponent } from './nodal-mapping.component';

const routes: Routes = [{ path: '', component: NodalMappingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NodalMappingRoutingModule { }
