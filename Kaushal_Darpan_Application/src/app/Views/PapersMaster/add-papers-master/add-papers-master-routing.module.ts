import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPapersMasterComponent } from './add-papers-master.component';

const routes: Routes = [{ path: '', component: AddPapersMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddPapersMasterRoutingModule { }
