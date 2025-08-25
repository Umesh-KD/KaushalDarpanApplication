import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { cbtcenterComponent } from './cbt-center.component';

const routes: Routes = [{ path: '', component: cbtcenterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class cbtcenterRoutingModule { }
