import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CounsellingSelectedOptionListComponent } from './counselling-selectedoptionlist.component';





const routes: Routes = [{ path: '', component: CounsellingSelectedOptionListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CounsellingSelectedOptionListRoutingModule { }
