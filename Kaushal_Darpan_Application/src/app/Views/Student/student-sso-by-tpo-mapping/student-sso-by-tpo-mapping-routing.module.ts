import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentSsoByTpoMappingComponent } from './student-sso-by-tpo-mapping.component';

const routes: Routes = [{ path: '', component: StudentSsoByTpoMappingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentSsoByTpoMappingRoutingModule { }
