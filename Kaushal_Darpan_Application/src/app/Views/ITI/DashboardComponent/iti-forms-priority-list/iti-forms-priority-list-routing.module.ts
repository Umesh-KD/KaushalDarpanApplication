import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiFormsPriorityListComponent } from './iti-forms-priority-list.component';

const routes: Routes = [{ path: '', component: ItiFormsPriorityListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiFormsPriorityListRoutingModule { }
