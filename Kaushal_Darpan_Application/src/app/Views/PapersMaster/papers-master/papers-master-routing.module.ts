import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PapersMasterComponent } from './papers-master.component';

const routes: Routes = [{ path: '', component: PapersMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PapersMasterRoutingModule { }
