import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditQualificationListRoutingModule } from './edit-qualification-list-routing.module';
import { EditQualificationListComponent } from './edit-qualification-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EditQualificationListComponent
  ],
  imports: [
    CommonModule,
    EditQualificationListRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EditQualificationListModule { }
