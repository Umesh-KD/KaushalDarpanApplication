import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostMasterComponent } from './post-master.component';

const routes: Routes = [{ path: '', component: PostMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostMasterRoutingModule { }
