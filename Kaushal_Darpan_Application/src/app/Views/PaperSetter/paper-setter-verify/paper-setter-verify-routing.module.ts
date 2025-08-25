import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaperSetterVerifyComponent } from './paper-setter-verify.component';

const routes: Routes = [{ path: '', component: PaperSetterVerifyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaperSetterVerifyRoutingModule { }
