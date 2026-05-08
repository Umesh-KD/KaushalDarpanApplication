import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiOrderMasterComponent } from './iti-order-master.component';

const routes: Routes = [{ path: '', component: ItiOrderMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiOrderMasterRoutingModule { }
