import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SsoidUpdateComponent } from './ssoid-update.component';

const routes: Routes = [{ path: '', component: SsoidUpdateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SsoidUpdateRoutingModule { }
