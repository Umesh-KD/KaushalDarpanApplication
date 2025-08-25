import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIGovtPrincipalMultipleInstituteAlloatListComponent } from './ITI-Govt-Principal-Multiple-Institute-AlloatList.component';




const routes: Routes = [{ path: '', component: ITIGovtPrincipalMultipleInstituteAlloatListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIGovtPrincipalMultipleInstituteAlloatListRoutingModule { }
