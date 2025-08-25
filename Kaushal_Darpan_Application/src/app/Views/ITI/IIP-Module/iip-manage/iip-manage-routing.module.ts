import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIIIPManageComponent } from './iip-manage.component';

const routes: Routes = [{ path: '', component: ITIIIPManageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIIIPManageRoutingModule { }
