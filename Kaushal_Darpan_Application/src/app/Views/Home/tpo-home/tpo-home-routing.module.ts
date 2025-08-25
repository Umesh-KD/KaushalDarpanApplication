import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TPOHomeComponent } from './tpo-home.component';

const routes: Routes = [{ path: '', component: TPOHomeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TPOHomeRoutingModule { }
