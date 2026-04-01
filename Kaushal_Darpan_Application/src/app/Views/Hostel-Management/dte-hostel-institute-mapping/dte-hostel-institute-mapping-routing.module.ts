import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DTEHostelInstituteMappingComponent } from './dte-hostel-institute-mapping.component';


const routes: Routes = [{ path: '', component: DTEHostelInstituteMappingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DTEHostelInstituteMappingRoutingModule { }
