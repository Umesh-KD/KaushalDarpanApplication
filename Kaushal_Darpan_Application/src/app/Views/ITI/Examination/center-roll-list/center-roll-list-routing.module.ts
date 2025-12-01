import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CenterRollListComponent } from './center-roll-list.component';

const routes: Routes = [{ path: '', component: CenterRollListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CenterRollListRoutingModule { }
