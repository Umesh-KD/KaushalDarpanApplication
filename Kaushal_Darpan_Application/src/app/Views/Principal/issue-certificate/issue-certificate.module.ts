import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueCertificateRoutingModule } from './issue-certificate-routing.module';
import { IssueCertificateComponent } from './issue-certificate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';

@NgModule({
  declarations: [
    IssueCertificateComponent
  ],
  imports: [
    CommonModule,FormsModule,
    IssueCertificateRoutingModule, LoaderModule
  ]
})
export class IssueCertificateModule { }
