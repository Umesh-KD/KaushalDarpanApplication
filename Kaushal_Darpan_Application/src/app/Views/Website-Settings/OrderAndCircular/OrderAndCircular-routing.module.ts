import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderAndCircularComponent } from './OrderAndCircular.component';

const routes: Routes = [{ path: '', component: OrderAndCircularComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderAndCircularRoutingModule { }
