import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddITIsComponent } from './add-itis.component';

const routes: Routes = [{ path: '', component: AddITIsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddITIsRoutingModule { }
