import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaperSetterAssignListComponent } from './paper-setter-assign-list.component';

const routes: Routes = [{ path: '', component: PaperSetterAssignListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaperSetterAssignListRoutingModule { }
