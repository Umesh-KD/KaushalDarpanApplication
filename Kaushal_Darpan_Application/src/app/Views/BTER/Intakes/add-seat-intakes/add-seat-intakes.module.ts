import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddSeatIntakesRoutingModule } from './add-seat-intakes-routing.module';
import { AddSeatIntakesComponent } from './add-seat-intakes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    AddSeatIntakesComponent
  ],
  imports: [
    CommonModule,
    AddSeatIntakesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ]
})
export class AddSeatIntakesModule { }
