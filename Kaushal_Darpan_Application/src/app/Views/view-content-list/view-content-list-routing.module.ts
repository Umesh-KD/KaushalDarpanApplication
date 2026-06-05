import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewContentListComponent } from './view-content-list.component';

const routes: Routes = [{ path: '', component: ViewContentListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewContentListRoutingModule { }
