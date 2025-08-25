import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BTERUpwardListComponent } from './BTERUpwardList.component';
const routes: Routes = [{ path: '', component: BTERUpwardListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BTERUpwardListRoutingModule { }
