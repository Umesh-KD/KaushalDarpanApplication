import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateNodalVerifierRoutingModule } from './create-nodal-verifier-routing.module';
import { CreateNodalVerifierComponent } from './create-nodal-verifier.component';


@NgModule({
  declarations: [
    CreateNodalVerifierComponent
  ],
  imports: [
    CommonModule,
    CreateNodalVerifierRoutingModule
  ]
})
export class CreateNodalVerifierModule { }
