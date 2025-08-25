import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddTspAreasRoutingModule } from './add-tsp-areas-routing.module';
import { AddTspAreasComponent } from './add-tsp-areas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../Shared/loader/loader.module';

@NgModule({
  declarations: [
    AddTspAreasComponent
  ],
  imports: [
    CommonModule,
    AddTspAreasRoutingModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule
  ]
})
export class AddTspAreasModule { }
