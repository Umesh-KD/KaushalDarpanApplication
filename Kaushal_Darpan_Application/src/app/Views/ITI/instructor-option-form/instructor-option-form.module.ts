import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstructorOptionFormRoutingModule } from './instructor-option-form-routing.module';
import { InstructorOptionFormComponent } from './instructor-option-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    InstructorOptionFormComponent
  ],
  imports: [
    CommonModule,
    InstructorOptionFormRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ],
  exports: [InstructorOptionFormComponent]
})
export class InstructorOptionFormModule { }
