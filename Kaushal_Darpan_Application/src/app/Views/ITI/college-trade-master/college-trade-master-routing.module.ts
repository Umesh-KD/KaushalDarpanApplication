import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollegeTradeMasterComponent } from './college-trade-master.component';

const routes: Routes = [{ path: '', component: CollegeTradeMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollegeTradeMasterRoutingModule { }
