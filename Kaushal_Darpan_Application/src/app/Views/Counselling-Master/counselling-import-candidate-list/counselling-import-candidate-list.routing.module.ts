import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CounsellingImportCandidateListComponent } from './counselling-import-candidate-list.component';





const routes: Routes = [{ path: '', component: CounsellingImportCandidateListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CounsellingImportCandidateListRoutingModule { }
