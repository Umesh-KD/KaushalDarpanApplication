import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IMCAllocationListComponent } from './imc-allocation-list.component';

const routes: Routes = [{ path: '', component: IMCAllocationListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IMCAllocationListRoutingModule { }
