import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampusPostHistoryComponent } from './campus-post-history.component';

const routes: Routes = [{ path: '', component: CampusPostHistoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampusPostHistoryRoutingModule { }
