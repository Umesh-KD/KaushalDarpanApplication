import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RedirectToSsoLoginComponent } from './redirect-to-sso-login.component';

const routes: Routes = [{ path: '', component: RedirectToSsoLoginComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RedirectToSsoLoginRoutingModule { }
