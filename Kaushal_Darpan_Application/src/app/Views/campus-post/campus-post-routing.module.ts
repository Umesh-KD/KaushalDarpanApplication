import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampusPostComponent } from './campus-post.component';

const routes: Routes = [{ path: '', component: CampusPostComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampusPostRoutingModule { }
