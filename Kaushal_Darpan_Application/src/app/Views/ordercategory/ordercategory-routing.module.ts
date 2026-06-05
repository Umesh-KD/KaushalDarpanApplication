import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderCategoryComponent } from './ordercategory.component';

const routes: Routes = [{ path: '', component: OrderCategoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderCategoryRoutingModule { }
