import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentSsoMappingComponent } from './student-sso-mapping.component';

const routes: Routes = [{ path: '', component: StudentSsoMappingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentSsoMappingRoutingModule { }
