import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UndertakingByExminerRoutingModule } from './undertaking-by-exminer-routing.module';
import { UndertakingByExminerComponent } from './undertaking-by-exminer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    UndertakingByExminerComponent
  ],
  imports: [
    CommonModule,
    UndertakingByExminerRoutingModule,FormsModule, ReactiveFormsModule, LoaderModule
  ]
})
export class UndertakingByExminerModule { }
