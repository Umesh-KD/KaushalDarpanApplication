import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiCampusPostListComponent } from './iticampus-post-list.component';

const routes: Routes = [{ path: '', component: ItiCampusPostListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiCampusPostListRoutingModule { }
