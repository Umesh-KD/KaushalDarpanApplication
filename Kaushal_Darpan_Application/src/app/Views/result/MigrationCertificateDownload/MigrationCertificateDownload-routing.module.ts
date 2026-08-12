import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MigrationCertificateDownloadComponent } from './MigrationCertificateDownload.component';

const routes: Routes = [{ path: '', component: MigrationCertificateDownloadComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MigrationCertificateDownloadRoutingModule { }
