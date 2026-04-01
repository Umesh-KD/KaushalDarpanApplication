import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DteHostelInstituteMappingListComponent } from './dte-hostel-institute-mapping-list.component';


const routes: Routes = [{ path: '', component: DteHostelInstituteMappingListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DteHostelInstituteMappingListRoutingModule { }
