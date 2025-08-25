import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupcodeAddRevalComponent } from './add-groupcode-reval.component';

const routes: Routes = [{ path: '', component: GroupcodeAddRevalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupcodeAddRevalRoutingModule { }
