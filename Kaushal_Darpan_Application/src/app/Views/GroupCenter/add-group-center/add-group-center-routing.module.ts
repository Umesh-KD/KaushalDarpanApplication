import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddGroupCenterComponent } from './add-group-center.component';

const routes: Routes = [{ path: '', component: AddGroupCenterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddGroupCenterRoutingModule { }
