import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupcodeAddComponent } from './add-groupcode.component';

const routes: Routes = [{ path: '', component: GroupcodeAddComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupcodeAddRoutingModule { }
