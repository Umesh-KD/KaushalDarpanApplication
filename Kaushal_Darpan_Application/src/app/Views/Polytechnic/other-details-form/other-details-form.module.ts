import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OtherDetailsFormRoutingModule } from './other-details-form-routing.module';
import { OtherDetailsFormComponent } from './other-details-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    OtherDetailsFormComponent
  ],
  imports: [
    CommonModule,
    OtherDetailsFormRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ]
})
export class OtherDetailsFormModule { }
