import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatchPrincipalRevalGroupCodeListComponent } from './DispatchPrincipalRevalGroupCode-list.component';

const routes: Routes = [{ path: '', component: DispatchPrincipalRevalGroupCodeListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispatchPrincipalRevalGroupCodeListRoutingModule { }
