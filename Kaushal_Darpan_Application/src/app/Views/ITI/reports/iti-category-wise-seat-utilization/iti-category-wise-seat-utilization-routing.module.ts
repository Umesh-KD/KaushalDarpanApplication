import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiCategoryWiseSeatUtilizationComponent } from './iti-category-wise-seat-utilization.component';

const routes: Routes = [{ path: '', component: ItiCategoryWiseSeatUtilizationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiCategoryWiseSeatUtilizationRoutingModule { }
