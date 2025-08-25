import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupCenterComponent } from './group-center.component';

const routes: Routes = [{ path: '', component: GroupCenterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupCenterRoutingModule { }
