import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiCertificateComponent } from './iti-certificate.component';

const routes: Routes = [{ path: '', component: ItiCertificateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiCertificateRoutingModule { }
