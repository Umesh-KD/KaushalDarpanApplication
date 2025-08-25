import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckPdfVerificationComponent } from './check-pdf-verification.component';

const routes: Routes = [{ path: '', component: CheckPdfVerificationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckPdfVerificationRoutingModule { }
