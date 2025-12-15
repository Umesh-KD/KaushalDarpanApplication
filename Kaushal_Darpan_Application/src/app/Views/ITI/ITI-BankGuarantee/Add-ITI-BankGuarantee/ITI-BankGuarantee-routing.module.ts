import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIBankGuaranteeComponent } from './ITI-BankGuarantee.component';

const routes: Routes = [{ path: '', component: ITIBankGuaranteeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIBankGuaranteeRoutingModule { }
