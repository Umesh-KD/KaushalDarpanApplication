import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrevianceMappingComponent } from './greviance-mapping.component';

const routes: Routes = [{ path: '', component: GrevianceMappingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrevianceMappingRoutingModule { }
