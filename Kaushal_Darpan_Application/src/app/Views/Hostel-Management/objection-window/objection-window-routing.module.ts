import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { objectionwindowComponent } from './objection-window.component';

const routes: Routes = [{ path: '', component: objectionwindowComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class objectionwindowRoutingModule { }
