import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignedCopyOfResultMasterComponent } from './SignedCopyOfResultMaster.component';





const routes: Routes = [{ path: '', component: SignedCopyOfResultMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignedCopyOfResultMasterRoutingModule { }
