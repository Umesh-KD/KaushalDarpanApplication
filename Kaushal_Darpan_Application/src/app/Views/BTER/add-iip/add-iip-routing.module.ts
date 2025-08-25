import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddIIPComponent } from './add-iip.component';

const routes: Routes = [{ path: '', component: AddIIPComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddIIPRoutingModule { }
