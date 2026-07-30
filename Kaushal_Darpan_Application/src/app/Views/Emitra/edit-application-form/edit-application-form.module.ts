import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditApplicationFormRoutingModule } from './edit-application-form-routing.module';
import { EditApplicationFormComponent } from './edit-application-form.component';


@NgModule({
  declarations: [
    EditApplicationFormComponent
  ],
  imports: [
    CommonModule,
    EditApplicationFormRoutingModule
  ]
})
export class EditApplicationFormModule { }
