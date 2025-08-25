import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatchPrincipalRevalGroupCodeFormComponent } from './DispatchPrincipalRevalGroupCode-form.component';

const routes: Routes = [{ path: '', component: DispatchPrincipalRevalGroupCodeFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispatchPrincipalRevalGroupCodeFormRoutingModule { }
