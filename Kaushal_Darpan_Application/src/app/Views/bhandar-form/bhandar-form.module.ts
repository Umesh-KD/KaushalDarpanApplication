import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BhandarFormRoutingModule } from './bhandar-form-routing.module';
import { BhandarFormComponent } from './bhandar-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  declarations: [
    BhandarFormComponent
  ],
  imports: [
    CommonModule,
    BhandarFormRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaterialTimepickerModule,
    MatFormFieldModule,
    MatInputModule,
  ]
})
export class BhandarFormModule { }
