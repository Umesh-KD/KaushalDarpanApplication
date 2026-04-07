import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIInspectionMembersComponent } from './iti-inspection-members.component';

const routes: Routes = [{ path: '', component: ITIInspectionMembersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIInspectionMembersRoutingModule { }
