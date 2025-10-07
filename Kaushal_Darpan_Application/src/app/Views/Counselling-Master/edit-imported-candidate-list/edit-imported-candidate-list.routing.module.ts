import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditImportedCandidateListComponent } from './edit-imported-candidate-list.component';





const routes: Routes = [{ path: '', component: EditImportedCandidateListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditImportedCandidateListRoutingModule { }
