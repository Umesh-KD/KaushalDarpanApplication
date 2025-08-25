import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddGroupsComponent } from './add-groups.component';

const routes: Routes = [{ path: '', component: AddGroupsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddGroupsRoutingModule { }
