import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiOptionFormListComponent } from './iti-option-form-list.component';

const routes: Routes = [{ path: '', component: ItiOptionFormListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiOptionFormListRoutingModule { }
