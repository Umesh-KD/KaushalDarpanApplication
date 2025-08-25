import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewVerifyRollListComponent } from './view-verify-roll-list.component';

const routes: Routes = [{ path: '', component: ViewVerifyRollListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewVerifyRollListRoutingModule { }
