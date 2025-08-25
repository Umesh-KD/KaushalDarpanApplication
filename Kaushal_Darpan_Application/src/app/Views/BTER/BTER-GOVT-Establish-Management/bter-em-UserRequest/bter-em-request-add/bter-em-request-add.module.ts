import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BtereEMRequestAddRoutingModule } from './bter-em-request-add-routing.module';
import { BtereEMRequestAddComponent } from './bter-em-request-addComponent';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    BtereEMRequestAddComponent
  ],
  imports: [
    CommonModule,
    BtereEMRequestAddRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ]
})
export class BtereEMRequestAddModule { }
