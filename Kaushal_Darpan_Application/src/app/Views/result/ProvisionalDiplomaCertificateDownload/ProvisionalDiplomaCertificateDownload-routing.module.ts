import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProvisionalDiplomaCertificateDownloadComponent } from './ProvisionalDiplomaCertificateDownload.component';

const routes: Routes = [{ path: '', component: ProvisionalDiplomaCertificateDownloadComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProvisionalDiplomaCertificateDownloadRoutingModule { }
