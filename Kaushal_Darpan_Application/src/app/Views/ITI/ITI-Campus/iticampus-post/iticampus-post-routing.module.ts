import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiCampusPostComponent } from './iticampus-post.component';

const routes: Routes = [{ path: '', component: ItiCampusPostComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiCampusPostRoutingModule { }
