import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OptionFormTabRoutingModule } from './option-form-tab-routing.module';
import { OptionFormTabComponent } from './option-form-tab.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    OptionFormTabComponent
  ],
  imports: [
    CommonModule,
    OptionFormTabRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ]
})
export class OptionFormTabModule { }
