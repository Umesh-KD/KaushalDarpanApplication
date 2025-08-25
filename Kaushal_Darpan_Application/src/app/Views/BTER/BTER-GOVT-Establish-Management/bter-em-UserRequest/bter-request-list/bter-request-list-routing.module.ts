import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BterUserRequestListComponent } from './bter-request-list.component';


const routes: Routes = [{ path: '', component: BterUserRequestListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BterUserRequestListRoutingModule { }
