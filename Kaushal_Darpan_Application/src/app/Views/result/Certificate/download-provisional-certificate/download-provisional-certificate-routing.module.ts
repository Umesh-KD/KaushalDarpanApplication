import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DownloadProvisionalCertificateComponent } from './download-provisional-certificate.component';

const routes: Routes = [{ path: '', component: DownloadProvisionalCertificateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DownloadProvisionalCertificateRoutingModule { }
