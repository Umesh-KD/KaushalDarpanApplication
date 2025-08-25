import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPublicInfoComponent } from './list-public-info.component';

const routes: Routes = [{ path: '', component: ListPublicInfoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListPublicInfoRoutingModule { }
