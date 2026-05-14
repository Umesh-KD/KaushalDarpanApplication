import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RenumerationAccountsRevalComponent } from './renumeration-accounts-reval.component';

const routes: Routes = [{ path: '', component: RenumerationAccountsRevalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RenumerationAccountsRevalRoutingModule { }
