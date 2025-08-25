import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyRollListPdfComponent } from './verify-roll-list-pdf.component';

const routes: Routes = [{ path: '', component: VerifyRollListPdfComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifyRollListPdfRoutingModule { }
