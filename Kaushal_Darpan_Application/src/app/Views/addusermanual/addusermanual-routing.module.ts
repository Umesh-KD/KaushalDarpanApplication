import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddusermanualComponent } from './addusermanual.component';

const routes: Routes = [{ path: '', component: AddusermanualComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddusermanualRoutingModule { }
