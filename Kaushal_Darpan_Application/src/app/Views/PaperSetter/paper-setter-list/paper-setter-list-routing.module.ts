import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaperSetterListComponent } from './paper-setter-list.component';

const routes: Routes = [{ path: '', component: PaperSetterListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaperSetterListRoutingModule { }
