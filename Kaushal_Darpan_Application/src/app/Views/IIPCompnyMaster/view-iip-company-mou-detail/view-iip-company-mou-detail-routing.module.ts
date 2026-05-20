import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewIipCompanyMouDetailComponent } from './view-iip-company-mou-detail.component';

const routes: Routes = [{ path: '', component: ViewIipCompanyMouDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewIipCompanyMouDetailRoutingModule { }
