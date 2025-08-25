import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IDFFundDetailListComponent } from './idffund-detail-list.component';

const routes: Routes = [{ path: '', component: IDFFundDetailListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IDFFundDetailListRoutingModule { }
