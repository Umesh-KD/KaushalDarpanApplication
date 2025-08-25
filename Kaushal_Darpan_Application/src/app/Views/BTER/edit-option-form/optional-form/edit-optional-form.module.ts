import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditOptionalFormRoutingModule } from './edit-optional-form-routing.module';
//import { OptionalFormComponent } from './optional-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    //OptionalFormComponent
  ],
  imports: [
    CommonModule,
    EditOptionalFormRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule

  ]
})
export class EditOptionalFormModule { }
