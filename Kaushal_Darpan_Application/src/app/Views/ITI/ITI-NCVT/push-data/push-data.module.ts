import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PushDataRoutingModule } from './push-data-routing.module';
import { PushDataComponent } from './push-data.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    PushDataComponent
  ],
  imports: [
    CommonModule,
    PushDataRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ]
})
export class PushDataModule { }
