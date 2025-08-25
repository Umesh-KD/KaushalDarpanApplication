import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CertificateLetterComponent } from './certificate-letter.component';

const routes: Routes = [{ path: '', component: CertificateLetterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CertificateLetterRoutingModule { }
