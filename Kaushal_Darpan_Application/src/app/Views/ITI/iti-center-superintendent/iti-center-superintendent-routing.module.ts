import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiCenterSuperintendentComponent } from './iti-center-superintendent.component';

const routes: Routes = [{ path: '', component: ItiCenterSuperintendentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiCenterSuperintendentRoutingModule { }
