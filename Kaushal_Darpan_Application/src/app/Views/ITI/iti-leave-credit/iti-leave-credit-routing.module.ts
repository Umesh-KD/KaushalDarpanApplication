import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiLeaveCreditComponent } from './iti-leave-credit.component';

const routes: Routes = [{ path: '', component: ItiLeaveCreditComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiLeaveCreditRoutingModule { }
