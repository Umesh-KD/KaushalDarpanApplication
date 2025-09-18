import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditQualificationRoutingModule } from './edit-qualification-routing.module';
import { EditQualificationComponent } from './edit-qualification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EditQualificationComponent
  ],
  imports: [
    CommonModule,
    EditQualificationRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EditQualificationModule { }
