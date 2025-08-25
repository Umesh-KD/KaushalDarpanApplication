import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatchSuperintendentFormComponent } from './DispatchSuperintendent-form.component';

const routes: Routes = [{ path: '', component: DispatchSuperintendentFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispatchSuperintendentFormRoutingModule { }
