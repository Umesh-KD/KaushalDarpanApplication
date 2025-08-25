import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Iti8ThCategoryWiseSeatUtilizationComponent } from './iti-8th-category-wise-seat-utilization.component';

const routes: Routes = [{ path: '', component: Iti8ThCategoryWiseSeatUtilizationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Iti8ThCategoryWiseSeatUtilizationRoutingModule { }
