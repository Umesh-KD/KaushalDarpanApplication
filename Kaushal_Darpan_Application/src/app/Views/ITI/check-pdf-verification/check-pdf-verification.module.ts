import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckPdfVerificationRoutingModule } from './check-pdf-verification-routing.module';
import { CheckPdfVerificationComponent } from './check-pdf-verification.component';


@NgModule({
  declarations: [
    CheckPdfVerificationComponent
  ],
  imports: [
    CommonModule,
    CheckPdfVerificationRoutingModule
  ]
})
export class CheckPdfVerificationModule { }
