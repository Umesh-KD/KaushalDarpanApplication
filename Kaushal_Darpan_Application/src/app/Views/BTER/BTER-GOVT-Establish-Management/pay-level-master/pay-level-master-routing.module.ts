import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayLevelMasterComponent } from './pay-level-master.component';

const routes: Routes = [{ path: '', component: PayLevelMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayLevelMasterRoutingModule { }
