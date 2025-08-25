import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIDispatchSuperintendentFormComponent } from './ITI-DispatchSuperintendent-form.component';

const routes: Routes = [{ path: '', component: ITIDispatchSuperintendentFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIDispatchSuperintendentFormRoutingModule { }
