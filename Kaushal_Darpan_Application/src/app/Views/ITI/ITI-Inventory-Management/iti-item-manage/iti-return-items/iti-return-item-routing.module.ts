import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddItiReturnItemComponent } from './iti-return-item.component';

const routes: Routes = [{ path: '', component: AddItiReturnItemComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddItiReturnItemRoutingModule { }
