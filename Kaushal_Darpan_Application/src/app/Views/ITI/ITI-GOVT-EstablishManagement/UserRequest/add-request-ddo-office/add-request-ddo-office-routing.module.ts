import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddRequestDDOOfficeComponent } from './add-request-ddo-office.component';

const routes: Routes = [{ path: '', component: AddRequestDDOOfficeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddRequestDDOOfficeRoutingModule { }
