import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsermanualComponent } from './usermanual.component';

const routes: Routes = [{ path: '', component: UsermanualComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsermanualRoutingModule { }
