import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITISeatMatrixComponent } from './itiseat-matrix.component';

const routes: Routes = [{ path: '', component: ITISeatMatrixComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITISeatMatrixRoutingModule { }
