import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampusPostListComponent } from './campus-post-list.component';

const routes: Routes = [{ path: '', component: CampusPostListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampusPostListRoutingModule { }
