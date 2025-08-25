import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiTradeWiseResultComponent } from './iti-tradewiseresult.component';

const routes: Routes = [{ path: '', component: ItiTradeWiseResultComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiTradeWiseResultRoutingModule { }
