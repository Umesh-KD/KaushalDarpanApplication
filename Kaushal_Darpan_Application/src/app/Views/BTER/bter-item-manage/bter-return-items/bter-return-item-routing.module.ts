import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBterReturnItemComponent } from './bter-return-item.component';

const routes: Routes = [{ path: '', component: AddBterReturnItemComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddBterReturnItemRoutingModule { }
