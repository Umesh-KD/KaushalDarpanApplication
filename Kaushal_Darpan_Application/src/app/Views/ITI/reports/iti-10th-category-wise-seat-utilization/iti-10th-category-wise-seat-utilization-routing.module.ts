import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Iti10ThCategoryWiseSeatUtilizationComponent } from './iti-10th-category-wise-seat-utilization.component';

const routes: Routes = [{ path: '', component: Iti10ThCategoryWiseSeatUtilizationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Iti10ThCategoryWiseSeatUtilizationRoutingModule { }
