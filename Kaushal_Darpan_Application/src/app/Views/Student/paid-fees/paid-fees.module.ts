import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaidFeesRoutingModule } from './paid-fees-routing.module';
import { PaidFeesComponent } from './paid-fees.component';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    PaidFeesComponent
  ],
  imports: [
    CommonModule,
    PaidFeesRoutingModule,
    LoaderModule
  ]
})
export class PaidFeesModule { }
