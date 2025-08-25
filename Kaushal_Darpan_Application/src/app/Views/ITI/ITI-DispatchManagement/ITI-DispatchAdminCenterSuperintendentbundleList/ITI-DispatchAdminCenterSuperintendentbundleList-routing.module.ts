import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIDispatchAdminCenterSuperintendentbundleListComponent } from './ITI-DispatchAdminCenterSuperintendentbundleList.component';

const routes: Routes = [{ path: '', component: ITIDispatchAdminCenterSuperintendentbundleListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIDispatchAdminCenterSuperintendentbundleListRoutingModule { }
