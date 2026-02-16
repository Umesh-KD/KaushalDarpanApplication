import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { bterSanctionedPostsComponent } from './bter-Sanctioned-posts.component';


const routes: Routes = [{ path: '', component: bterSanctionedPostsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class bterSanctionedPostsRoutingModule { }
