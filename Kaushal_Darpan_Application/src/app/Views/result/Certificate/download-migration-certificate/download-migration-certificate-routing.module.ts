import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DownloadMigrationCertificateComponent } from './download-migration-certificate.component';

const routes: Routes = [{ path: '', component: DownloadMigrationCertificateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DownloadMigrationCertificateRoutingModule { }
