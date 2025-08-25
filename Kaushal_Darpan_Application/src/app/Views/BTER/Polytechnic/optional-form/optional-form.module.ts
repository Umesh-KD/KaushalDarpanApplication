import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OptionalFormRoutingModule } from './optional-form-routing.module';
import { OptionalFormComponent } from './optional-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    OptionalFormComponent
  ],
  imports: [
    CommonModule,
    OptionalFormRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule

  ]
})
export class OptionalFormModule { }
