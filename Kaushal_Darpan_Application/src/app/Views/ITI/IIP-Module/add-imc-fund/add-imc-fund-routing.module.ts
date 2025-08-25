import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddItiIMCFundComponent } from './add-imc-fund.component';

const routes: Routes = [{ path: '', component: AddItiIMCFundComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddItiIMCFundRoutingModule { }
