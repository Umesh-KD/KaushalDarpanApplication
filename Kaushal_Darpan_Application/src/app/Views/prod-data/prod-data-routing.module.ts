import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProdDataComponent } from './prod-data.component';

const routes: Routes = [{ path: '', component: ProdDataComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProdDataRoutingModule { }
